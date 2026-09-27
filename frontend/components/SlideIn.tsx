import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  faXmark,
  faClipboard,
  faArrowsToCircle,
} from "@fortawesome/free-solid-svg-icons";
import type { TrailData } from "./TrailMap.web";
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  ScrollView,
  TextInput,
} from "react-native";

type propTypes = {
  selectedTrail: TrailData | null;
  displayedTrails: TrailData[] | null;
  handleDeselect: (name: string) => void;
  handleSelect: (name: string) => void;
  center: () => void;
};

function SlideIn(props: propTypes) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!props.displayedTrails) {
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

  const filterTrails = (searchTerm: string, trails: TrailData[]) => {
    return trails.filter((trail) => {
      return trail.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  if (props.selectedTrail) {
    return (
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Pressable
            onPress={() => {
              if (props.selectedTrail?.name) {
                props.handleDeselect(props.selectedTrail.name);
              }
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Pressable>
          <Pressable onPress={props.center}>
            <FontAwesomeIcon icon={faArrowsToCircle} />
          </Pressable>
          <Pressable
            onPress={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            <FontAwesomeIcon icon={faClipboard} />
          </Pressable>
        </View>
        <Text style={styles.title}>{props.selectedTrail.name}</Text>
        <Text style={styles.description}>
          {generateDescription(props.selectedTrail) || "no description"}
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trails</Text>
      <TextInput
        placeholder="Search"
        style={styles.searchBar}
        value={searchTerm}
        onChangeText={setSearchTerm}
      ></TextInput>
      {props.displayedTrails.length === 0 && <Text>No trails found</Text>}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filterTrails(searchTerm, props.displayedTrails).map((trail) => (
          <Pressable
            key={trail._id}
            style={styles.shownTrailContainer}
            onPress={() => {
              props.handleSelect(trail.name);
            }}
          >
            <Text>{trail.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    position: "absolute",
    borderRadius: 20,
    top: 0,
    right: 0,
    height: "100%",
    width: 320,
    zIndex: 1000,
    backgroundColor: "white",
    padding: 24,
    boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.15)",
    // overflowY: "auto",
  },
  shownTrailContainer: {
    borderColor: "lightgrey",
    padding: 8,
    borderWidth: 1,
    borderRadius: 3,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  description: {
    marginTop: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  searchBar: {
    height: 40,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 4,
  },
});

export default SlideIn;
