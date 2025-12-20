#ifndef PUMP
#define PUMP

class Pump {
  public:
    Pump(int pin, float flowRateMLPerMin);
    void pumpVolume(float volumeML);

  private:
      int pumpPin;
      float flowRate; // ml/min
  };

#endif