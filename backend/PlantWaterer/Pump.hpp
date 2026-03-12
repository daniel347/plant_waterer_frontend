#ifndef PUMP
#define PUMP
#include <ctime>

class Pump {
  public:
    Pump(int pin, float flowRateMLPerMin);
    void pumpVolume(float volumeML);
    void startPump();
    void stopPump();
    float pumpedSoFar();

  private:
      int pumpPin;
      float flowRate; // ml/min

      time_t pumpOnTime;
  };

#endif