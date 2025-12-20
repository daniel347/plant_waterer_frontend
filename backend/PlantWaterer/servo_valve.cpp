#include "servo_valve.hpp"
#include <ESP32Servo.h>
#include <Arduino.h>

ServoValve::ServoValve(int pin, int enPin) : servoPin(pin), valveEnPin(enPin) {}

void ServoValve::begin() {
    pinMode(valveEnPin, OUTPUT);
    close();
    digitalWrite(valveEnPin, 1);
}

void ServoValve::open() {
    // digitalWrite(valveEnPin, 1);
    // delay(1000);
        // delay(1000);
    valveServo.attach(servoPin);
    valveServo.write(servoOpenAngle);
    delay(servoMoveDelay); // allow servo to move
        // delay(1000);
    valveServo.detach();
    // digitalWrite(valveEnPin, 0);
}

void ServoValve::close() {
    // digitalWrite(valveEnPin, 1);
    // delay(1000);
    valveServo.attach(servoPin);
    valveServo.write(servoClosedAngle);
    delay(servoMoveDelay);
    valveServo.detach();
    // digitalWrite(valveEnPin, 0);
}