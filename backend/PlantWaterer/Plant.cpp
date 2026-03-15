
#include "plant.hpp"
#include <Arduino.h>
#include "servo_valve.hpp"
#include "MoistureSensor.hpp"
#include "pump.hpp"
#include <ctime>
#include "util.h"

WaterSettings::WaterSettings(const char* _startMode,
                      unsigned long _intervalMillis,
                      float _startMoistureThresh,
                      unsigned long _maxIntervalMillis,
                      unsigned long _minIntervalMillis,
                      const char* _quantityMode,
                      float _volumeML,
                      float _stopMoistureThresh,
                      float _maxVolumeML) :
    intervalMillis(_intervalMillis  * 3600000L), startMoistureThresh(_startMoistureThresh), maxIntervalMillis(_maxIntervalMillis * 3600000L),
    minIntervalMillis(_minIntervalMillis * 3600000L), volumeML(_volumeML), stopMoistureThresh(_stopMoistureThresh), maxVolumeML(_maxVolumeML) 
    {
        if (strcmp(_startMode, "Moisture") == 0) { startMode = StartSignal::StartMoisture; }
        else if (strcmp(_startMode, "PlateDry") == 0) { startMode = StartSignal::StartPlateDry; }
        else if (strcmp(_startMode, "Interval") == 0) { startMode = StartSignal::StartInterval; }

        if (strcmp(_quantityMode, "Moisture") == 0) { quantityMode = QuantitySignal::QuantityMoisture; }
        else if (strcmp(_quantityMode, "PlateWet") == 0) { quantityMode = QuantitySignal::QuantityPlateWet; }
        else if (strcmp(_quantityMode, "Volume") == 0) { quantityMode = QuantitySignal::QuantityVolume; }
    }

Plant::Plant(const char* name, ServoValve* valve, MoistureSensor* sensor, WaterSettings _settings, time_t lastWateredT=0, bool isDisabled=false, bool _sensorUnderPlate=false)
: plantName(name), valvePtr(valve), sensorPtr(sensor), settings(_settings), lastWatered(lastWateredT), 
   disabled(isDisabled), sensorUnderPlate(_sensorUnderPlate), hasSensor((sensor != NULL)){}

void Plant::water(Pump& pump) {
    valvePtr->open();
    if (settings.quantityMode == QuantitySignal::QuantityVolume) {
        pump.pumpVolume(settings.volumeML);
    }
    else if (settings.quantityMode == QuantitySignal::QuantityMoisture) {
        pump.startPump();
        while (sensorPtr->read_water_saturation() < settings.stopMoistureThresh &&
                     pump.pumpedSoFar() <settings.maxVolumeML) {
            delay(2000);
            Serial.println(sensorPtr->read_water_saturation());
        };
        pump.stopPump();
    }
    else if (settings.quantityMode == QuantitySignal::QuantityPlateWet) {
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
    
    if (settings.startMode == StartSignal::StartInterval) {
        return (now - lastWatered) >= (settings.intervalMillis / 1000);
    }
    else if (settings.startMode == StartSignal::StartMoisture) {
        return (sensorPtr->read_water_saturation() < settings.startMoistureThresh);
    }
    else if (settings.startMode == StartSignal::StartPlateDry) {
        return !sensorPtr->plate_is_wet();
    }
}

float Plant::readSensor() {
    if (hasSensor) {
        if (sensorUnderPlate) {
            return sensorPtr->plate_is_wet();
        }
        else {
            return sensorPtr->read_water_saturation();
        }
    }
}

void Plant::setPlateDryBaseline() {
    sensorPtr->set_dry_plate_reading();
}

const char* Plant::getName() { return plantName; }

void Plant::updateSettings(WaterSettings _settings) {
    settings = _settings;
}

void Plant::clearPipe(Pump& pump, float vol) {
    valvePtr->open();
    pump.pumpVolume(vol);
    valvePtr->close();
}