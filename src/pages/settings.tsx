import React from 'react';
import {Text, View} from 'react-native';

const SettingsPage: React.FC = () => {
  const connect = async () => {
    console.log('connect');
  };
  return (
    <View className="flex flex-col mt-6 ml-20 mr-20 gap-8 flex-grow items-center">
      <Text className="text-3xl font-semibold">Settings</Text>
      <View>
      <Text className="text-xl font-semibold">General</Text>
      </View>
    </View>
  );
};

export default SettingsPage;
