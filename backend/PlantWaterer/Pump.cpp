#include "pump.hpp"
#include <Arduino.h>

Pump::Pump(int pin, float flowRateMLPerMin)
        : pumpPin(pin), flowRate(flowRateMLPerMin) {
        pinMode(pumpPin, OUTPUT);
        digitalWrite(pumpPin, LOW);
    }

void Pump::pumpVolume(float volumeML) {
    unsigned long pumpTime = (unsigned long)((volumeML / flowRate) * 60000UL);
    digitalWrite(pumpPin, HIGH);
    delay(pumpTime); // blocking, but fine here since pump is the only active task
    digitalWrite(pumpPin, LOW);
}

