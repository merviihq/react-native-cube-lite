import React, { type ReactNode } from 'react';
import {
  ActivityIndicator,
  Button,
  Modal,
  View,
  type ButtonProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import WebView from 'react-native-webview';
import AutoHeightWebView from 'react-native-autoheight-webview';

export type cubeParam = {
  publicKey: string;
  amount?: number;
  currency?: string;
  country?: string;
  paymentOptions?: Array<string>;
  customerName: string;
  customerPhone: string;
  customerPhone2?: string;
  customerEmail?: string;
  merchantTitle?: string;
  merchantDescription?: string;
  merchantLogo?: string;
  handleDelivery?: boolean;
  chargeDelivery?: boolean;
  itemWeight?: number;
  deliveryItems?: unknown;
  pickupLocation?: unknown;
  redirectUrl?: string;
};

type cubeResp = {
  type: 'error' | 'cancel' | 'failed' | 'success';
  data: unknown;
};

type Props = React.ComponentProps<typeof View> &
  cubeParam & {
    containerStyle?: StyleProp<ViewStyle>;
    modalStyle?: StyleProp<ViewStyle>;
    modalTransparent?: boolean;
    modalAnimationType?: 'none' | 'slide' | 'fade' | undefined;
    modalProps?: typeof Modal;
    webViewStyle?: StyleProp<ViewStyle>;
    webViewProps?: typeof WebView;
    activityIndicatorColour?: string;
    activityIndicatorProps?: typeof ActivityIndicator;
    customButtonProps: {
      ButtonComp?: ReactNode | Button;
      ButtonCompProps?: ButtonProps;
    };
    buttonTitle?: string;
    //Cube params
    onError: (data: unknown) => void;
    onCancel: (data: unknown) => void;
    onFailed: (data: unknown) => void;
    onSuccess: (data: unknown) => void;
  };

export default function CubeLite(props: Props) {
  const config = {
    public_key: props.publicKey,
    amount: props.amount,
    currency: props.currency || 'NGN',
    country: props.country || 'NG',
    payment_options: props.paymentOptions || ['Transfer'],
    customer: {
      name: props.customerName,
      phone_number: props.customerPhone,
      email: props.customerEmail,
    },
    merchant_details: {
      title: props.merchantTitle || 'Cube by Mervii ',
      description: props.merchantDescription || 'Cube by Mervii',
      logo:
        props.merchantLogo ||
        'https://mervii.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FlogoText.28847f6c.png&w=1200&q=75',
    },
    handle_delivery: props.handleDelivery || false,
    charge_delivery: props.chargeDelivery || false,
    item_weight: props.itemWeight || null,
    delivery_items: props.deliveryItems || null,
    pickup_location: props.pickupLocation,
    redirect_url: props.redirectUrl || 'https://mervii.com',
  };

  const [values, setValues] = React.useState({
    loading: false,
    visible: false,
  });

  const { loading, visible } = values;

  const handleOnChange = (field: string, val: any) => {
    setValues((prevState) => ({ ...prevState, [field]: val }));
  };

  // console.log(JSON.stringify({config}));

  const { ...ButtonCompProps } = props.customButtonProps;

  // const CubeButton = ButtonComp || Button

  const CubeButton = Button;

  const messageReceived = async (rawData: any) => {
    // setValues(prev => ({ ...prev, visible: false, loading: false }));
    // let timeoutId: ReturnType<typeof setTimeout>;
    let webResponse;
    try {
      webResponse = JSON.parse(rawData);
    } catch (e) {
      return (
        props.onError &&
        props.onError({ error: 'Invalid response format', rawData })
      );
    }

    const { type, data: payload }: cubeResp = webResponse;
    const handlers = {
      error: () => props.onError && props.onError(payload),
      cancel: () => {
        setValues((prev) => ({ ...prev, visible: false, loading: false }));
        props.onCancel(payload);
      },
      failed: () => props.onFailed(payload),
      success: () => {
        setValues((prev) => ({ ...prev, visible: false, loading: false }));
        if (props.onSuccess) return props.onSuccess(payload);
        return webResponse;
      },
    };
    const handler =
      handlers[type] ||
      (() =>
        props.onError({
          error: 'Unknown transaction type',
          data: webResponse,
        }));
    try {
      return handler();
    } catch (err) {
      console.error('Handler threw:', err);
      return props.onError({
        error: 'Handler error',
        details: err,
        data: webResponse,
      });
    }
  };

  const htmlContent = `
    <html><head>
      <script src='https://cube.mervii.com/beta/cube.js'></script>
    </head><body>
      <script>
        const cubeConfig = ${JSON.stringify(config)};
        cubeConfig.onSuccess = tx => window.ReactNativeWebView.postMessage(JSON.stringify({type:'success', data: tx}));
        cubeConfig.onFailed  = tx => window.ReactNativeWebView.postMessage(JSON.stringify({type:'failed', data: tx}));
        cubeConfig.onCancel  = tx => window.ReactNativeWebView.postMessage(JSON.stringify({type:'cancel', data: tx}));
        cubeConfig.onError   = err => window.ReactNativeWebView.postMessage(JSON.stringify({type:'error', data: err}));
        // Initialize Cube
        CubeSDK.config(cubeConfig);
      </script>
    </body></html>
  `;

  console.log(JSON.stringify({ loading, visible }));
  return (
    <View style={[props.containerStyle]}>
      <Modal
        style={[props.modalStyle]}
        visible={visible}
        animationType={props.modalAnimationType || 'slide'}
        transparent={props.modalTransparent || true}
        {...props.modalProps}
      >
        <AutoHeightWebView
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          onMessage={(e) => {
            messageReceived(e.nativeEvent.data);
          }}
          style={[props.webViewStyle]}
          // scalesPageToFit={true}
          javaScriptEnabled={true}
          // automaticallyAdjustContentInsets
          onLoadStart={() => handleOnChange('loading', true)}
          onLoadEnd={() => handleOnChange('loading', false)}
          // mixedContentMode="always"
          // injectedJavaScriptBeforeContentLoaded={`(function() {
          //     var meta = document.createElement('meta');
          //     meta.setAttribute('name', 'viewport');
          //     meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover');
          //     document.head.appendChild(meta);
          //     var style = document.createElement('style');
          //     style.innerHTML = 'html, body { width:100%; height:100%; margin:0; padding:0; overflow:hidden; } #cube-container { width:100%; height:100%; }';
          //     document.head.appendChild(style);
          //   })();`}
          {...props.webViewProps}
        />
        {loading && (
          <ActivityIndicator
            size="large"
            color={props.activityIndicatorColour || 'purple'}
            {...props.activityIndicatorProps}
          />
        )}
      </Modal>

      <CubeButton
        disabled={loading}
        title={props.buttonTitle || 'Pay and Deliver'}
        onPress={() => handleOnChange('visible', true)}
        {...ButtonCompProps}
      />
    </View>
  );
}
