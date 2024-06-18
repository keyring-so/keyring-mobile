/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  NativeEventEmitter,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
// @ts-ignore
import Keycard from 'react-native-status-keycard';
import './global.css';
import {Button} from '@/components/ui/button'
import {Text} from '@/components/ui/text';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
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

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <Text>NFC: {nfcIsSupported.toString()}</Text>
          <Text>Log: {log}</Text>
          <Button>
            <Text>Default</Text>
          </Button>
          <Button onPress={getCardInfo}>
            <Text>Get Info</Text>
          </Button>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
