import {Settings as SettingsIcon} from '@/lib/icons/Settings';
import InitializeDialog from '@/components/initialize';
import PairDialog from '@/components/pair';
import {Button} from '@/components/ui/button';
import React, {useEffect} from 'react';
import {NativeEventEmitter, Text, View} from 'react-native';
import Keycard from 'react-native-status-keycard';

const ConnectPage: React.FC = () => {
  const [cardInitialized, setCardInitialized] = React.useState(false);
  const [connectDialog, setConnectDialog] = React.useState(false);
  const keycardEmitter = new NativeEventEmitter(Keycard);

  const connect = async () => {
    console.log('connect to card');
    try {
      CheckCardInitialized();
    } catch (err) {
      console.log(err);
    }
  };

  const CheckCardInitialized = () => {
    console.log('check card connection');

    keycardEmitter.addListener('keyCardOnConnected', async () => {
      console.log('card nfc connected...');
      const appInfo = await Keycard.getApplicationInfo();
      console.log(appInfo);
      setCardInitialized(appInfo['initialized?']);
      setConnectDialog(true);
      console.log('card initialized: ', appInfo['initialized?'], cardInitialized);

      Keycard.stopNFC('').then(() => console.log('nfc stopped'));
    });

    Keycard.startNFC('Hold your iPhone near a Keyring card.').then(() => {
      console.log('nfc started');
    });
  };

  const getInfo = async () => {
    setConnectDialog(true);
    setCardInitialized(false);
  };

  return (
    <View className="h-full">
      <View className="flex flex-col items-center justify-center gap-20 h-full">
        <View className="flex flex-col justify-center items-center">
          <Text className="font-semibold text-primary">Keyring Wallet</Text>
          <Text className="mt-4 font-medium text-primary">Welcome!</Text>
        </View>
        <Button className="" onPress={connect}>
          <Text className="text-green-300">Connect your Keyring Card</Text>
        </Button>

        <Button className="" onPress={getInfo}>
          <Text className="text-green-300">Get Info</Text>
        </Button>
      </View>
      <View className="absolute bottom-8 right-8">
        <SettingsIcon onPress={() => console.log('settings')} />
      </View>
      {connectDialog && cardInitialized === false && (<InitializeDialog handleClose={setConnectDialog} />)}
      {connectDialog && cardInitialized === true && (<PairDialog />)}
    </View>
  );
};

export default ConnectPage;
