#ifndef MOISTURE_SENSOR
#define MOISTURE_SENSOR
#include <Arduino.h>

class MoistureSensor {
  public:
    MoistureSensor(int p, bool plateSensor);
    void begin();
    float read_water_saturation();
    float read_adc_avg();
    void set_dry_plate_reading();
    bool plate_is_wet();
    bool isPlateSensor;


  private:
    int pin;

    int dry_reading = 0;
    int saturated_reading = 2600;

    float plate_dry_reading = 0;

    const int num_readings = 5;
    const int reading_delay = 25;
    const int plate_wet_thresh = 10;
};
#endif