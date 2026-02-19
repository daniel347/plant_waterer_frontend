#ifndef UTIL
#define UTIL

#include <ctime>
#include <Arduino.h>

time_t getEpochTime() {
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) return 0;
    return mktime(&timeinfo);
}
#endif // UTIL