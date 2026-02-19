#include "pump.hpp"
#include "util.cpp"
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

void Pump::startPump() {
    pumpOnTime = getEpochTime();
    digitalWrite(pumpPin, HIGH);
}

void Pump::stopPump() {
    digitalWrite(pumpPin, LOW);
}

float Pump::pumpedSoFar() {
    now = getEpochTime();
    unsigned long pumpTimeS = (now - pumpOnTime);
    return float(pumpTimeS) * flowRate / 60.0;
}
