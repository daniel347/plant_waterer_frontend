
#include "plant.hpp"
#include <Arduino.h>
#include "servo_valve.hpp"
#include "pump.hpp"
#include <ctime>
#include "util.cpp"


Plant::Plant(const char* name, ServoValve* valve, MoistureSensor* sensor, WaterSettings _settings, time_t lastWateredT=0, bool isDisabled=false)
: plantName(name), valvePtr(valve), sensorPtr(sensor), settings(_settings), lastWatered(lastWateredT),
   disabled(isDisabled) {}

void Plant::water(Pump& pump) {
    valvePtr->open();
    if (quantityMode == QuantitySignal::Volume) {
        pump.pumpVolume(settings.volumeML);
    }
    else if (quantityMode == QuantitySignal::Moisture) {
        pump.startPump();
        while (sensorPtr->read_water_saturation() < settings.stopMoistureThresh &&
                     pump.pumpedSoFar() <settings.maxVolumeML) {
            delay(2000);
        };
        pump.stopPump();
    }
    else if (quantityMode == QuantitySignal::PlateWet) {
        pump.startPump();
        while (!sensorPtr->plate_is_wet() &&
                 pump.pumpedSoFar() < settings.maxVolumeML) {
            delay(2000);
        };
        pump.stopPump();
    }
    valvePtr->close();
    lastWatered = getEpochTime();
}

bool Plant::needsWater() {
    if (disabled) {
        return false;
    }
    time_t now = getEpochTime();
    if ((now - lastWatered) >= (settings.maxIntervalMillis / 1000)) {
        Serial.println("Watering as beyond max interval");
        return true;
    }
    else if ((now - lastWatered) <= (settings.minIntervalMillis / 1000)) {
        Serial.println("Not watering as before min interval");
        return false;
    }
    
    if (settings.startMode == StartSignal::Interval) {
        return (now - lastWatered) >= (settings.intervalMillis / 1000);
    }
    else if (settings.startMode == StartSignal::Moisture) {
        return (sensorPtr->read_water_saturation() < settings.startMoistureThresh);
    }
    else if (settings.startMode == StartSignal::PlateDry) {
        return !sensorPtr->plate_is_wet();
    }
}

const char* Plant::getName() { return plantName; }

void Plant::updateSettings(WaterSettings _settings) {
    settings = _settings;
}