/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {NativeEventEmitter, SafeAreaView, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
// @ts-ignore
import {open} from 'react-native-quick-sqlite';
import Keycard from 'react-native-status-keycard';
import './global.css';
import {applyMigrations, DB_NAME} from './lib/database';
import ConnectPage from './pages/connect';

let db;

function App(): React.JSX.Element {
  const [dbVersion, setDbVersion] = React.useState(0);
  const isDarkMode = useColorScheme() === 'dark';
  const [nfcIsSupported, setNfcIsSupported] = React.useState(false);
  const [log, setLog] = React.useState('');
  const keycardEmitter = new NativeEventEmitter(Keycard);

  useEffect(() => {
    keycardEmitter.addListener('keyCardOnConnected', () => {
      setLog('keycard connected...');
      console.log('keycard is connected now..');
      console.log('keycard init');
      const pin = '123456';
      Keycard.init(pin).then(secrets => {
        console.log(secrets);
        console.log('stop nfc');
        Keycard.stopNFC('').then(() => console.log('nfc stopped'));
      });
    });
    keycardEmitter.addListener('keyCardOnDisconnected', () =>
      setLog('keycard disconnected'),
    );
    Keycard.nfcIsSupported().then((isSupported: boolean) => {
      if (isSupported) {
        setNfcIsSupported(true);
        console.log('NFC is supported');
      } else {
        console.log('NFC is not supported');
      }
    });

    // initialize database
    db = open({name: DB_NAME});
    applyMigrations(db);
  });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const getCardInfo = async () => {
    // Keycard.getApplicationInfo().then(info => console.log(info));
    console.log('start nfc');
    Keycard.startNFC('Hold your iPhone near a Keyring card.').then(() => {
      console.log('keycard started..');
    });
  };

  const schemaVersion = () => {
    const result = db.execute('PRAGMA user_version;');
    console.log('result:', result);
    setDbVersion(result.rows.item(0).user_version);
  };

  return (
    <SafeAreaView className="flex flex-col">
      {/* <Button onPress={schemaVersion}>
        <Text>Show version</Text>
      </Button> */}
      {/* <Text>{dbVersion}</Text> */}
      <ConnectPage />
    </SafeAreaView>
  );
}

export default App;
