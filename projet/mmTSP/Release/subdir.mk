################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
CPP_SRCS += \
../generation.cpp \
../individual.cpp \
../main.cpp \
../tictoc.cpp 

OBJS += \
./generation.o \
./individual.o \
./main.o \
./tictoc.o 

CPP_DEPS += \
./generation.d \
./individual.d \
./main.d \
./tictoc.d 


# Each subdirectory must supply rules for building sources it contributes
%.o: ../%.cpp
	@echo 'Building file: $<'
	@echo 'Invoking: GCC C++ Compiler'
	g++ -O3 -Wall -c -fmessage-length=0 -MMD -MP -MF"$(@:%.o=%.d)" -MT"$(@:%.o=%.d)" -o"$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


