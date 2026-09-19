import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faClipboard } from "@fortawesome/free-solid-svg-icons";
import type { TrailData } from "./TrailMap.web";
import { StyleSheet, View, Pressable, Text } from "react-native";

type propTypes = {
  trailData: TrailData | null;
  onClose: (name: string) => void;
};

function SlideIn(props: propTypes) {
  if (!props.trailData) {
    return null;
  }

  const generateDescription = (trailData: TrailData) => {
    const avgWalkSpeed = 3.5;

    const distanceInKm = trailData.distance / 1000;
    const estimatedTime = distanceInKm / avgWalkSpeed;

    let estimatedTimeString = "";

    if (estimatedTime < 1) {
      const minutes = Math.round(estimatedTime * 60);
      estimatedTimeString = `${minutes} minutes`;
    } else {
      const hours = Math.floor(estimatedTime);
      const minutes = Math.round((estimatedTime - hours) * 60);

      if (minutes === 0) {
        estimatedTimeString = `${hours} hour${hours !== 1 ? "s" : ""}`;
      } else {
        estimatedTimeString = `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minutes`;
      }
    }

    const description = `${trailData.name} is a ${distanceInKm.toFixed(1)} km trail that takes an estimated ${estimatedTimeString} to complete.`;

    return description;
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.closeButton}
        onPress={() => {
          if (!props.trailData) {
            return;
          }

          if (props.trailData.name) {
            props.onClose(props.trailData.name);
          }
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </Pressable>
      <Text style={styles.title}>{props.trailData.name}</Text>
      <Text style={styles.description}>
        {generateDescription(props.trailData)
          ? generateDescription(props.trailData)
          : "no description"}
      </Text>
      <Pressable
        style={styles.copyButton}
        onPress={() => {
          const dummy = document.createElement("input");
          const text = window.location.href;
          document.body.appendChild(dummy);
          dummy.value = text;
          dummy.select();
          document.execCommand("copy");
          document.body.removeChild(dummy);
        }}
      >
        <FontAwesomeIcon icon={faClipboard} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    position: "absolute",
    borderRadius: 20,
    top: 0,
    left: 0,
    height: "100%",
    width: 320,
    zIndex: 1000,
    backgroundColor: "white",
    padding: 24,
    boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.15)",
    // overflowY: "auto",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  description: {
    marginTop: 16,
  },
  closeButton: {
    marginBottom: 16,
  },
  copyButton: {
    marginTop: 16,
  },
});

export default SlideIn;
