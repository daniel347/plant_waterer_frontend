#include "MoistureSensor.hpp"
#include <Arduino.h>

MoistureSensor::MoistureSensor(int p, bool plateSensor) : pin(p), isPlateSensor(plateSensor) {}

void MoistureSensor::begin() {
    pinMode(pin, INPUT);
}

float MoistureSensor::read_adc_avg() {
    int adc_read = 0;
    for (int i=0; i < num_readings; i++) {
        adc_read += analogRead(pin);
        delay(reading_delay);
    }
    return float(adc_read / num_readings);
}

float MoistureSensor::read_water_saturation() {
    float read_avg = read_adc_avg();
    return (float(read_avg - dry_reading) / float(saturated_reading - dry_reading)) * 100.0;
}

void MoistureSensor::set_dry_plate_reading() {
    plate_dry_reading = read_adc_avg();
    Serial.println("Plate dry reading:");
    Serial.println(plate_dry_reading);
}

bool MoistureSensor::plate_is_wet() {
    float read_avg = read_adc_avg();
    Serial.println("reading:");
    Serial.println(read_avg);
    return (plate_dry_reading - read_avg) > plate_wet_thresh;
}

