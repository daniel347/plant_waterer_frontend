#include <ctime>
#include <Arduino.h>
#include "util.h"

time_t getEpochTime() {
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) return 0;
    return mktime(&timeinfo);
}