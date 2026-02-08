import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import { useGetDoctorRawQuery } from '../store/doctorApi';
import type {
  RootStackParamList,
  MainTabParamList,
} from '../navigation/AppNavigator';
import type { Doctor } from '../types';
import DoctorCard from '../components/DoctorCard';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'DoctorList'>,
  NativeStackScreenProps<RootStackParamList>
>;

const DoctorListScreen = ({ navigation }: Props) => {
  const {
    data: doctors,
    isLoading,
    isError,
    refetch,
  } = useGetDoctorRawQuery();

  if (isLoading) {
    return <LoadingView />;
  }

  if (isError) {
    return (
      <ErrorView
        message="Failed to load doctors."
        onRetry={refetch}
      />
    );
  }

  if (!doctors || doctors.length === 0) {
    return <ErrorView message="No doctors available." />;
  }

  const renderItem = ({ item }: { item: Doctor }) => (
    <DoctorCard
      doctor={item}
      onPress={() => navigation.navigate('DoctorDetail', { doctorId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={doctors}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  list: {
    paddingVertical: 8,
  },
});

export default DoctorListScreen;
