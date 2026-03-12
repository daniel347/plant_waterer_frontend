#ifndef SERVO_VALVE
#define SERVO_VALVE
#include <ESP32Servo.h>

class ServoValve {
  public:
    ServoValve(int pin, int enPin);
    void begin();
    void open();
    void close();
    int servoPin;

  private:
    int valveEnPin;
    Servo valveServo;
    int servoMoveDelay = 500;  //ms
    int servoOpenAngle = 180;
    int servoClosedAngle = 0;
};

#endif