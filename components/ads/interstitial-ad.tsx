import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import {
    AdEventType,
    InterstitialAd,
    TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === "ios"
    ? "ca-app-pub-3940256099942544/4411468910"
    : "ca-app-pub-3940256099942544/1033173712";

interface UseInterstitialAdProps {
  onAdClosed?: () => void;
  onAdFailedToShow?: () => void;
}

export const useInterstitialAd = ({
  onAdClosed,
  onAdFailedToShow,
}: UseInterstitialAdProps = {}) => {
  const [interstitial, setInterstitial] = useState<InterstitialAd | null>(null);
  const [loaded, setLoaded] = useState(false);

  const loadInterstitial = useCallback(() => {
    const ad = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    ad.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    ad.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error("Interstitial ad error:", error);
      setLoaded(false);
    });

    ad.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      onAdClosed?.();
      loadInterstitial(); // Load next ad
    });

    ad.load();
    setInterstitial(ad);
  }, [onAdClosed]);

  const showInterstitial = useCallback(() => {
    if (loaded && interstitial) {
      interstitial.show();
    } else {
      onAdFailedToShow?.();
    }
  }, [loaded, interstitial, onAdFailedToShow]);

  useEffect(() => {
    loadInterstitial();
  }, [loadInterstitial]);

  return {
    loaded,
    showInterstitial,
    loadInterstitial,
  };
};
