# react-native-cube-lite

react native cube sdk for delivery and payment

## Installation

```sh
npm install '@merviihq/react-native-cube-lite'
```

## Usage

```js
import { View, StyleSheet } from 'react-native';
import CubeLite from '@merviihq/react-native-cube-lite';

// ...

export default function App() {
  return (
    <View style={[styles.container,{alignItems:'center'}]}>

      <CubeLite
        publicKey='CU_PK_TEST-T'
        amount={200.90}
        customerEmail="developers@mervii.com"
        customerName="Mervii Developer"
        customerPhone="07045417072"
        handleDelivery={true}
        chargeDelivery={true}
        onCancel={(data:any)=>console.log(JSON.stringify(data))}
        onFailed={(data:any)=>console.log(JSON.stringify(data))}
        onError={(data:any)=>console.log(JSON.stringify(data))}
        onSuccess={(data:any)=>console.log(JSON.stringify(data))}
        buttonTitle="Pay Now !"
        pickupLocation={{
        region: {
          latitude: 7.427026700000001,
          longitude: 3.8900142,
        },
        city: "Ibadan",
        state_code: "YO",
        country_code: "NG",
        contacts: {
          name: "John Done",
          phone_number: "07045417072",
          phone_number_2: "",
          email: "sales@mervii.com",
        },
        pickup_date: "09-07-2024",
        pickup_time: "03:40PM",
        pickup_note: "Ask for John",
        formattedAddress: "95 Poly Road Sango, Ibadan 200132, Oyo, Nigeria",
      }}

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
});
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
