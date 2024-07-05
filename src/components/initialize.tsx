import {ChevronDown} from '@/lib/icons/ChevronDown';
import {ChevronUp} from '@/lib/icons/ChevronUp';
import {zodResolver} from '@hookform/resolvers/zod';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Text, View} from 'react-native';
import {number, z} from 'zod';
import {Button} from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Form,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
  FormRadioGroup,
} from './ui/form';
import {Tabs, TabsContent, TabsList, TabsTrigger} from './ui/tabs';
import {RadioGroup, RadioGroupItem} from './ui/radio-group';
import {Input} from './ui/input';
import Toast from 'react-native-toast-message';
import {Label} from './ui/label';

const InitCardSchema = z.object({
  name: z.string().min(2).max(20),
  pin: z.string().transform((val, ctx) => {
    if (val.length !== 6 || isNaN(Number(val))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'PIN must have 6 digits',
      });

      return z.NEVER;
    }
    return val;
  }),
  checksum: z.enum(['4', '6', '8'], {
    required_error: 'You need to choose the count of words.',
  }),
});

const LoadSecretWordsSchema = z.object({
  name: z.string().min(2).max(20),
  pin: z.string().transform((val, ctx) => {
    if (val.length !== 6 || isNaN(Number(val))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'PIN must have 6 digits',
      });

      return z.NEVER;
    }
    return val;
  }),
  mnemonics: z.array(z.object({word: z.string()})),
});

type Props = {
  handleClose: (open: boolean) => void;
};

const InitializeDialog = ({handleClose}: Props) => {
  const [moreWords, setMoreWords] = useState(false);

  useEffect(() => {
    console.log('init dialog');
  }, []);

  const setTab = () => {
    console.log('set tab');
  };

  const initForm = useForm<z.infer<typeof InitCardSchema>>({
    resolver: zodResolver(InitCardSchema),
    defaultValues: {
      checksum: '4',
    },
  });

  const loadForm = useForm<z.infer<typeof LoadSecretWordsSchema>>({
    resolver: zodResolver(LoadSecretWordsSchema),
  });

  const mnemonicFields = () => {
    return (
      <View className="grid grid-cols-4 items-center gap-2">
        {Array.from({length: 24}).map((_, i) => word(i))}
      </View>
    );
  };

  const word = (index: number) => {
    if (index > 11 && !moreWords) return;
    return (
      <View
        className="flex flex-row items-center gap-1 justify-end"
        key={index}>
        <Text>{index + 1}.</Text>
        <Input
          className="bg-secondary w-[90px]"
          autoCorrect={false}
          {...loadForm.register(`mnemonics.${index}.word`)}
        />
      </View>
    );
  };

  const loadWords = async (data: z.infer<typeof LoadSecretWordsSchema>) => {
    const mnemonicLength = data.mnemonics.length;
    if (mnemonicLength < 12 || mnemonicLength > 24) {
      Toast.show({
        text1: 'Invalid data.',
        text2: 'Secret phrase must have 12, 15, 18, 21 or 24 words.',
      });
    }
    try {
      const words = data.mnemonics
        .map(item => item.word.trim())
        .join(' ')
        .trim();
      const res = await LoadSecrePhrase(data.pin, data.name, words);
      // setAccount(res.cardInfo);
      Toast.show({
        text1: 'Success!',
        text2: 'Card is initialized.',
      });
    } catch (err) {
      Toast.show({
        text1: 'Uh oh! Something went wrong.',
        text2: `Error happens: ${err}`,
      });
    }
  };

  const LoadSecrePhrase = async (pin: string, name: string, words: string) => {
    console.log('load secret phrase');
    return {
      cardInfo: {
        name,
        pin,
        words,
      },
    };
  };

  const initCard = async (data: z.infer<typeof InitCardSchema>) => {
    console.log('init card');
    console.log(data);
  };

  return (
    <View className="bg-yellow-300">
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              The card is empty, do you want to initalize it?
            </DialogTitle>
            <DialogDescription>
              Write down the secret phrase and keep them safe, it's the only way
              to recover your funds if you lose your card and PIN.
            </DialogDescription>
            <DialogDescription>
              PIN is used to protect your card from unauthorized access.
            </DialogDescription>
          </DialogHeader>
          <Tabs value="no-mnemonic" className="" onValueChange={setTab}>
            <TabsList className="grid h-auto p-1 grid-cols-2 bg-gray-200 rounded-lg">
              <TabsTrigger className="text-md rounded-lg" value="no-mnemonic">
                <Text>Create</Text>
              </TabsTrigger>
              <TabsTrigger className="text-md rounded-lg" value="has-mnemonic">
                <Text>Import</Text>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="has-mnemonic">
              <Form {...loadForm}>
                <FormField
                  control={loadForm.control}
                  name="mnemonics"
                  render={() => {
                    return (
                      <View>
                        <FormLabel nativeID="label-for-seed">
                          Input your secret phrase
                        </FormLabel>
                        {mnemonicFields()}
                        <View className="self-center">
                          {!moreWords ? (
                            <ChevronDown
                              className="bg-primary text-primary-foreground rounded-full"
                              onPress={() => setMoreWords(true)}
                            />
                          ) : (
                            <ChevronUp
                              className="bg-primary text-primary-foreground rounded-full"
                              onPress={() => setMoreWords(false)}
                            />
                          )}
                        </View>
                      </View>
                    );
                  }}
                />
                <FormField
                  control={loadForm.control}
                  name="pin"
                  render={({field}) => (
                    <FormInput
                      label="Input your PIN"
                      autoComplete="off"
                      {...field}
                    />
                    // <FormItem className="flex flex-row items-center justify-between">
                    //   <FormLabel>Input your PIN:</FormLabel>
                    //   <FormControl>
                    //     <Input
                    //       type="password"
                    //       className="w-2/3"
                    //       onChange={field.onChange}
                    //     />
                    //   </FormControl>
                    //   <FormMessage />
                    // </FormItem>
                  )}
                />
                <FormField
                  control={loadForm.control}
                  name="name"
                  render={({field}) => (
                    <FormInput
                      label="Name the card"
                      autoComplete="off"
                      {...field}
                    />
                    // <FormItem className="flex flex-row items-center justify-between">
                    //   <FormLabel>Name the card:</FormLabel>
                    //   <FormControl>
                    //     <Input
                    //       className="w-2/3"
                    //       onChange={field.onChange}
                    //       autoCorrect="off"
                    //     />
                    //   </FormControl>
                    //   <FormMessage />
                    // </FormItem>
                  )}
                />
                <Button onPress={loadForm.handleSubmit(loadWords)}>
                  <Text>Submit</Text>
                </Button>
              </Form>
            </TabsContent>
            <TabsContent value="no-mnemonic">
              <Form {...initForm}>
                <FormField
                  control={initForm.control}
                  name="checksum"
                  render={({field}) => {
                    function onPress(value: '4' | '6' | '8') {
                      return () => {
                        initForm.setValue('checksum', value);
                      };
                    }

                    return (
                      <FormRadioGroup
                        label="Choose the count of secret phrase"
                        {...field}>
                        {(['4', '6', '8'] as const).map(value => {
                          return (
                            <View
                              key={value}
                              className={'flex-row gap-2 items-center'}>
                              <RadioGroupItem
                                aria-labelledby={`label-for-${value}`}
                                value={value}
                              />
                              <Label
                                nativeID={`label-for-${value}`}
                                className="capitalize"
                                onPress={onPress(value)}>
                                {Number(value) * 3}
                              </Label>
                            </View>
                          );
                        })}
                      </FormRadioGroup>
                    );
                  }}
                />
                <FormField
                  control={initForm.control}
                  name="pin"
                  render={({field}) => (
                    <FormInput
                      label="Input your PIN"
                      autoComplete="off"
                      {...field}
                    />
                  )}
                />
                <FormField
                  control={initForm.control}
                  name="name"
                  render={({field}) => (
                    <FormInput
                      label="Name the card"
                      autoComplete="off"
                      {...field}
                    />
                  )}
                />
                <Button onPress={initForm.handleSubmit(initCard)}>
                  <Text className="text-green-300">Submit</Text>
                </Button>
              </Form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </View>
  );
};

{
  /* {mnemonic && mnemonicDialog()} */
}

export default InitializeDialog;
