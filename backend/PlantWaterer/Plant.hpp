
#ifndef PLANT
#define PLANT
#include "servo_valve.hpp"
#include "pump.hpp"
#include <ctime>

class Plant {
public:
    Plant(const char* name, ServoValve* valve, float waterVolumeML, unsigned int intervalHours, time_t lastWatered, bool isDisabled);
    void water(Pump& pump);
    bool needsWater();
    const char* getName();
    void updateSettings(float waterVolumeML, unsigned int intervalHours);
    time_t lastWatered;
    bool disabled;

private:
    const char* plantName;
    ServoValve* valvePtr;
    float volumeML;
    unsigned long intervalMillis;

    time_t getEpochTime();
};

#endif