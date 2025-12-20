
#include "plant.hpp"
#include <Arduino.h>
#include "servo_valve.hpp"
#include "pump.hpp"
#include <ctime>


Plant::Plant(const char* name, ServoValve* valve, float waterVolumeML, unsigned int intervalHours, time_t lastWateredT=0, bool isDisabled=false)
: plantName(name), valvePtr(valve), volumeML(waterVolumeML),
  intervalMillis(intervalHours * 3600000UL), lastWatered(lastWateredT),
   disabled(isDisabled) {}

void Plant::water(Pump& pump) {
    valvePtr->open();
    pump.pumpVolume(volumeML);
    valvePtr->close();
    lastWatered = getEpochTime();
}

bool Plant::needsWater() {
    if (disabled) {
        return false;
    }
    time_t now = getEpochTime();
    Serial.print("time: ");
    Serial.println(now);
    Serial.print("last watered: ");
    Serial.println(lastWatered);
    Serial.print("interval: ");
    Serial.println(intervalMillis / 1000);
    return (now - lastWatered) >= (intervalMillis / 1000);
}

const char* Plant::getName() { return plantName; }

void Plant::updateSettings(float waterVolumeML, unsigned int intervalHours) {
    volumeML = waterVolumeML;
    intervalMillis = ((unsigned long) intervalHours) * 3600000UL;

    Serial.println("Updating plant with settings");
    Serial.print("volume: ");
    Serial.println(volumeML);
    Serial.print("interval: ");
    Serial.println(intervalMillis);
}

time_t Plant::getEpochTime() {
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) return 0;
    return mktime(&timeinfo);
}