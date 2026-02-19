
#ifndef PLANT
#define PLANT
#include "servo_valve.hpp"
#include "pump.hpp"
#include <ctime>

enum StartSignal {
  Interval,
  Moisture,
  PlateDry,
}; 

enum QuantitySignal {
    Volume,
    Moisture,
    PlateWet.
}

class WaterSettings {
    public:
        WaterSettings(StartSignal _startMode,
                      unsigned long _intervalMillis,
                      float _startMoistureThresh,
                      unsigned long _maxIntervalMillis,
                      unsigned long _minIntervalMillis
                      QuantitySignal _quantityMode,
                      float _volumeML,
                      float _stopMoistureThresh,
                      float _maxVolumeML);

        StartSignal startMode;
        
        // interval params
        unsigned long intervalMillis;

        // moisture params
        float startMoistureThresh;

        // plate dry params
        
        // shared
        unsigned long maxIntervalMillis;  // water after this time even if other conditions are not satisfied
        unsigned long minIntervalMillis;  // dont water before this time even if other conditions are met

        QuantitySignal quantityMode;

        // volume params
        float volumeML;

        // moisture params
        float stopMoistureThresh;

        // plate dry params

        // shared
        float maxVolumeML;  // stop watering at this volume even if the conditions are not satisfied
}

class Plant {
public:
    Plant(const char* name, ServoValve* valve, MoistureSensor* sensor, WaterSettings settings, time_t lastWatered, bool isDisabled);
    void water(Pump& pump);
    bool needsWater();
    const char* getName();
    void updateSettings(WaterSettings _settings);
    time_t lastWatered;
    bool disabled;

private:
    const char* plantName;
    ServoValve* valvePtr;
    MoistureSensor* sensorPtr;

    WaterSettings settings;
};

#endif