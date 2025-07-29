import { StyleSheet, View } from 'react-native';
import CubeLite from '@merviihq/react-native-cube-lite';

export default function App() {
  return (
    <View style={styles.container}>
      <CubeLite
        publicKey="CU_PK_TEST-TujzMiXszaXEIGep4kXgqgpa9vquZ952TZ11wiMO"
        amount={200.9}
        customerEmail="developers@mervii.com"
        customerName="Mervii Developer"
        customerPhone="07045417072"
        handleDelivery={false}
        chargeDelivery={false}
        onCancel={(data: any) => console.log(JSON.stringify(data))}
        onFailed={(data: any) => console.log(JSON.stringify(data))}
        onError={(data: any) => console.log(JSON.stringify(data))}
        onSuccess={(data: any) => console.log(JSON.stringify(data))}
        buttonTitle="Pay Now !"
        pickupLocation={{
          region: {
            latitude: 7.427026700000001,
            longitude: 3.8900142,
          },
          city: 'Ibadan',
          state_code: 'YO',
          country_code: 'NG',
          contacts: {
            name: 'John Done',
            phone_number: '07045417072',
            phone_number_2: '',
            email: 'sales@mervii.com',
          },
          pickup_date: '09-07-2024',
          pickup_time: '03:40PM',
          pickup_note: 'Ask for John',
          formattedAddress: '95 Poly Road Sango, Ibadan 200132, Oyo, Nigeria',
        }}
        customButtonProps={{}}
        // modalTransparent={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
