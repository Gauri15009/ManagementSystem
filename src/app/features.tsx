
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useEmployees } from '../context/EmployeeContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

const PHOTO_KEY = '@management_latest_photo';
const LOCATION_KEY = '@management_last_checkin';
const ATTENDANCE_KEY = '@management_attendance_records';

type ApiUser = {
  id: number;
  name: string;
  email: string;
  company?: {
    name?: string;
  };
};

type CheckInRecord = {
  employeeId: string;
  employeeName: string;
  latitude: number;
  longitude: number;
  time: string;
};

export default function FeaturesScreen() {
  const { employees } = useEmployees();

  // API feature
  const [apiUsers, setApiUsers] = useState<ApiUser[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // AsyncStorage feature
  const [savedPhoto, setSavedPhoto] = useState<string | null>(null);
  const [lastCheckIn, setLastCheckIn] = useState<CheckInRecord | null>(null);
  const [savedRecordCount, setSavedRecordCount] = useState(0);

  // Camera feature
  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraBusy, setCameraBusy] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  // Location feature
  const [locationBusy, setLocationBusy] = useState(false);

  // Dashboard and gesture feature
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchText, setSearchText] = useState('');

  const statsFade = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.94)).current;
  const swipePosition = useRef(new Animated.ValueXY()).current;

  // Load stored data and animate the dashboard.
  useEffect(() => {
    loadSavedData();

    Animated.parallel([
      Animated.timing(statsFade, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 7,
        tension: 55,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Fetch external sample directory data.
  const fetchApiUsers = async () => {
    setApiLoading(true);
    setApiError('');

    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );

      if (!response.ok) {
        throw new Error('Could not retrieve directory data.');
      }

      const data: ApiUser[] = await response.json();
      setApiUsers(data);
    } catch {
      setApiError('Unable to load API data. Check your internet connection.');
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    fetchApiUsers();
  }, []);

  const loadSavedData = async () => {
    try {
      const photo = await AsyncStorage.getItem(PHOTO_KEY);
      const location = await AsyncStorage.getItem(LOCATION_KEY);
      const attendance = await AsyncStorage.getItem(ATTENDANCE_KEY);

      setSavedPhoto(photo);

      if (location) {
        setLastCheckIn(JSON.parse(location));
      }

      if (attendance) {
        const records: CheckInRecord[] = JSON.parse(attendance);
        setSavedRecordCount(records.length);
      }
    } catch {
      Alert.alert('Storage error', 'Could not load saved information.');
    }
  };

  // Use real employee records from your existing context.
  const filteredEmployees = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) return employees;

    return employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query) ||
        String(employee.id).toLowerCase().includes(query)
    );
  }, [employees, searchText]);

  const employeesRef = useRef(filteredEmployees);
  employeesRef.current = filteredEmployees;

  const safeIndex =
    filteredEmployees.length > 0
      ? currentIndex % filteredEmployees.length
      : 0;

  const currentEmployee = filteredEmployees[safeIndex];

  // Keep the selected index valid when searching or adding employees.
  useEffect(() => {
    setCurrentIndex(0);
    swipePosition.setValue({ x: 0, y: 0 });
  }, [searchText, employees.length, swipePosition]);

  // Animate the employee card off-screen and show the next profile.
  const swipeCard = (direction: number) => {
    const count = employeesRef.current.length;

    if (count <= 1) {
      Animated.spring(swipePosition, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(swipePosition, {
      toValue: { x: direction * SCREEN_WIDTH, y: 0 },
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;

      setCurrentIndex((index) => (index + direction + count) % count);
      swipePosition.setValue({ x: 0, y: 0 });
      cardScale.setValue(0.94);

      Animated.spring(cardScale, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }).start();
    });
  };

  const swipeCardRef = useRef(swipeCard);
  swipeCardRef.current = swipeCard;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 12 &&
        Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.2,

      onPanResponderMove: (_, gesture) => {
        swipePosition.setValue({
          x: gesture.dx,
          y: gesture.dy * 0.1,
        });
      },

      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -80) {
          swipeCardRef.current(1);
        } else if (gesture.dx > 80) {
          swipeCardRef.current(-1);
        } else {
          Animated.spring(swipePosition, {
            toValue: { x: 0, y: 0 },
            friction: 6,
            useNativeDriver: true,
          }).start();
        }
      },

      onPanResponderTerminate: () => {
        Animated.spring(swipePosition, {
          toValue: { x: 0, y: 0 },
          friction: 6,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  // Camera: request permission, open camera, capture and save a photo.
  const openCamera = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();

      if (!permission.granted) {
        Alert.alert(
          'Camera permission required',
          'Allow camera access to capture a profile photo.'
        );
        return;
      }
    }

    setCameraOpen(true);
  };

  const capturePhoto = async () => {
    if (!cameraRef.current || cameraBusy) return;

    setCameraBusy(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });

      if (!photo?.uri) {
        throw new Error('Photo capture failed.');
      }

      await AsyncStorage.setItem(PHOTO_KEY, photo.uri);
      setCapturedPhoto(photo.uri);
      setSavedPhoto(photo.uri);
      setCameraOpen(false);

      Alert.alert('Photo saved', 'Your photo has been saved locally.');
    } catch {
      Alert.alert('Camera error', 'Unable to capture the photo.');
    } finally {
      setCameraBusy(false);
    }
  };

  // Location: record GPS coordinates and the selected employee's check-in.
  const recordCheckIn = async () => {
    if (!currentEmployee) {
      Alert.alert('No employee selected', 'Add an employee first.');
      return;
    }

    setLocationBusy(true);

    try {
      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert(
          'Location permission required',
          'Allow location access to record a GPS check-in.'
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({});

      const record: CheckInRecord = {
        employeeId: String(currentEmployee.id),
        employeeName: currentEmployee.name,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        time: new Date().toISOString(),
      };

      const existing = await AsyncStorage.getItem(ATTENDANCE_KEY);
      const records: CheckInRecord[] = existing ? JSON.parse(existing) : [];

      records.unshift(record);

      await AsyncStorage.setItem(
        ATTENDANCE_KEY,
        JSON.stringify(records)
      );
      await AsyncStorage.setItem(
        LOCATION_KEY,
        JSON.stringify(record)
      );

      setLastCheckIn(record);
      setSavedRecordCount(records.length);

      Alert.alert(
        'Check-in recorded',
        `${record.employeeName}'s check-in time and GPS coordinates were saved.`
      );
    } catch {
      Alert.alert(
        'Location error',
        'Unable to retrieve or save your location.'
      );
    } finally {
      setLocationBusy(false);
    }
  };

  const animatedCardStyle = {
    opacity: statsFade,
    transform: [
      ...swipePosition.getTranslateTransform(),
      { scale: cardScale },
    ],
  };

  const departmentCount = new Set(
    employees.map((employee) => employee.department).filter(Boolean)
  ).size;

  const today = new Date().toDateString();

  const todayCheckIns = lastCheckIn
    ? new Date(lastCheckIn.time).toDateString() === today
      ? 1
      : 0
    : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.heading}>Smart Workforce</Text>
      <Text style={styles.subtitle}>
        Manage employee records, review workforce data, and record GPS check-ins.
      </Text>

      {/* Animated dashboard statistics */}
      <View style={styles.statsRow}>
        <Animated.View
          style={[
            styles.statCard,
            { opacity: statsFade, transform: [{ scale: cardScale }] },
          ]}
        >
          <Text style={styles.statIcon}>👥</Text>
          <Text style={styles.statNumber}>{employees.length}</Text>
          <Text style={styles.statLabel}>Employees</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.statCard,
            { opacity: statsFade, transform: [{ scale: cardScale }] },
          ]}
        >
          <Text style={styles.statIcon}>🏢</Text>
          <Text style={styles.statNumber}>{departmentCount}</Text>
          <Text style={styles.statLabel}>Departments</Text>
        </Animated.View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.smallStatCard}>
          <Text style={styles.smallStatNumber}>{todayCheckIns}</Text>
          <Text style={styles.smallStatLabel}>Latest check-in today</Text>
        </View>

        <View style={styles.smallStatCard}>
          <Text style={styles.smallStatNumber}>{savedRecordCount}</Text>
          <Text style={styles.smallStatLabel}>Saved check-in records</Text>
        </View>
      </View>

      {/* Employee search */}
      <Text style={styles.sectionTitle}>Employee Directory</Text>

      <TextInput
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search by name, ID, or department"
        placeholderTextColor="#8992A3"
        autoCapitalize="none"
      />

      <Text style={styles.hint}>
        Swipe left or right to browse employee profiles.
      </Text>

      {currentEmployee ? (
        <>
          <Animated.View
            {...panResponder.panHandlers}
            style={[styles.employeeCard, animatedCardStyle]}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {currentEmployee.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            <Text style={styles.employeeName}>
              {currentEmployee.name}
            </Text>
            <Text style={styles.employeeDepartment}>
              {currentEmployee.department}
            </Text>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Employee ID</Text>
              <Text style={styles.infoValue}>
                {currentEmployee.id}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>
                {currentEmployee.department}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={recordCheckIn}
              disabled={locationBusy}
            >
              {locationBusy ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  Record GPS Check-in
                </Text>
              )}
            </TouchableOpacity>

            <Text style={styles.cardHint}>
              Swipe to change the selected employee.
            </Text>
          </Animated.View>

          <View style={styles.navigationRow}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => swipeCard(-1)}
            >
              <Text style={styles.navText}>← Previous</Text>
            </TouchableOpacity>

            <Text style={styles.counter}>
              {safeIndex + 1} of {filteredEmployees.length}
            </Text>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => swipeCard(1)}
            >
              <Text style={styles.navText}>Next →</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No matching employees</Text>
          <Text style={styles.hint}>
            Add an employee or try another search.
          </Text>
        </View>
      )}

      {/* Camera and local photo storage */}
      <Text style={styles.sectionTitle}>Profile Photo</Text>

      {cameraOpen ? (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="front"
          />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={capturePhoto}
            disabled={cameraBusy}
          >
            <Text style={styles.primaryButtonText}>
              {cameraBusy ? 'Capturing...' : 'Capture and Save Photo'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setCameraOpen(false)}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.featureCard}>
          <Text style={styles.featureText}>
            {savedPhoto
              ? 'A photo has been saved on this device.'
              : 'Capture a photo and save its local URI.'}
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={openCamera}
          >
            <Text style={styles.primaryButtonText}>
              {savedPhoto ? 'Take Another Photo' : 'Open Camera'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Last saved GPS check-in */}
      <Text style={styles.sectionTitle}>Latest GPS Check-in</Text>

      <View style={styles.featureCard}>
        {lastCheckIn ? (
          <>
            <Text style={styles.infoValue}>
              {lastCheckIn.employeeName}
            </Text>
            <Text style={styles.featureText}>
              Date and time: {new Date(lastCheckIn.time).toLocaleString()}
            </Text>
            <Text style={styles.featureText}>
              Latitude: {lastCheckIn.latitude.toFixed(5)}
            </Text>
            <Text style={styles.featureText}>
              Longitude: {lastCheckIn.longitude.toFixed(5)}
            </Text>
          </>
        ) : (
          <Text style={styles.featureText}>
            No check-in has been recorded yet.
          </Text>
        )}

        <Text style={styles.cardHint}>
          GPS coordinates record device location; they do not independently
          verify that an employee is at an approved workplace.
        </Text>
      </View>

      {/* External API feature */}
      <Text style={styles.sectionTitle}>External Directory API</Text>

      <View style={styles.featureCard}>
        <Text style={styles.featureText}>
          Sample user profiles loaded from JSONPlaceholder. These are external
          demo records, not your registered employees.
        </Text>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={fetchApiUsers}
          disabled={apiLoading}
        >
          <Text style={styles.secondaryButtonText}>
            {apiLoading ? 'Loading...' : 'Refresh API Data'}
          </Text>
        </TouchableOpacity>

        {apiLoading && <ActivityIndicator style={styles.loader} />}

        {!!apiError && <Text style={styles.errorText}>{apiError}</Text>}

        {!apiLoading &&
          apiUsers.slice(0, 5).map((user) => (
            <View key={user.id} style={styles.apiUser}>
              <View style={styles.apiAvatar}>
                <Text style={styles.apiAvatarText}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={styles.apiUserInfo}>
                <Text style={styles.apiName}>{user.name}</Text>
                <Text style={styles.apiEmail}>{user.email}</Text>
                <Text style={styles.apiCompany}>
                  {user.company?.name ?? 'No company listed'}
                </Text>
              </View>
            </View>
          ))}
      </View>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={loadSavedData}
      >
        <Text style={styles.secondaryButtonText}>
          Refresh Saved Information
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Employee totals use your existing EmployeeContext. Photo and check-in
        records are stored locally on this device.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1D2A44',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#6B7280',
    marginTop: 7,
    marginBottom: 22,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    minHeight: 125,
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#1D2A44',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  statIcon: {
    fontSize: 23,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 29,
    fontWeight: '800',
    color: '#3859B8',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  smallStatCard: {
    flex: 1,
    backgroundColor: '#E7EDFF',
    borderRadius: 14,
    padding: 14,
  },
  smallStatNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3859B8',
  },
  smallStatLabel: {
    fontSize: 11,
    color: '#4F5E7B',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1D2A44',
    marginTop: 22,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E6F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#1D2A44',
    marginBottom: 12,
  },
  hint: {
    color: '#7A8497',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  employeeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#1D2A44',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E3EAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#3859B8',
    fontSize: 30,
    fontWeight: '800',
  },
  employeeName: {
    color: '#1D2A44',
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },
  employeeDepartment: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8ECF4',
    width: '100%',
    marginVertical: 19,
  },
  infoRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  infoLabel: {
    color: '#7A8497',
    fontSize: 13,
  },
  infoValue: {
    color: '#27344D',
    fontSize: 13,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#3859B8',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#E5EAF8',
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#3859B8',
    fontSize: 13,
    fontWeight: '700',
  },
  cardHint: {
    color: '#8992A3',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  navButton: {
    backgroundColor: '#E5EAF8',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 13,
  },
  navText: {
    color: '#3859B8',
    fontSize: 12,
    fontWeight: '700',
  },
  counter: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#1D2A44',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    padding: 17,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#1D2A44',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  featureText: {
    color: '#596579',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 7,
  },
  cameraContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
  },
  camera: {
    height: 300,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  loader: {
    margin: 12,
  },
  errorText: {
    color: '#B42318',
    fontSize: 12,
    marginTop: 10,
  },
  apiUser: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF0F5',
  },
  apiAvatar: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: '#E3EAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  apiAvatarText: {
    color: '#3859B8',
    fontWeight: '800',
    fontSize: 17,
  },
  apiUserInfo: {
    flex: 1,
  },
  apiName: {
    color: '#27344D',
    fontSize: 13,
    fontWeight: '700',
  },
  apiEmail: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 3,
  },
  apiCompany: {
    color: '#8992A3',
    fontSize: 11,
    marginTop: 3,
  },
  footer: {
    color: '#8992A3',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 22,
  },
});
