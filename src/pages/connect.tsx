import {Button} from '@/components/ui/button';
import {Settings as SettingsIcon} from '@/components/icons/settings';
import React from 'react';
import {Text, View} from 'react-native';

const ConnectPage: React.FC = () => {
  const connect = async () => {
    console.log('connect');
  };
  return (
    <View>
      <View className="flex flex-col items-center justify-center gap-20 h-full">
        <View className="flex flex-col justify-center items-center">
          <Text className="font-semibold text-primary">Keyring Wallet</Text>
          <Text className="mt-4 font-medium text-primary">Welcome!</Text>
        </View>
        <Button className="" onPress={connect}>
          <Text className="text-green-300">Connect your Keyring Card</Text>
        </Button>
      </View>
      <View className="absolute bottom-8 right-8">
        <SettingsIcon onPress={() => console.log('settings')} />
      </View>
    </View>
  );
};

export default ConnectPage;
