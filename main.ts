// Handle commands from Manager Microbit
radio.onReceivedValue(function (name, value) {
    if (name == "calibrate_start") {
        basic.showIcon(IconNames.Target)
    } else if (name == "calibrate_set") {
        calibratedPitch = input.rotation(Rotation.Pitch)
        calibratedRoll = input.rotation(Rotation.Roll)
        isCalibrated = true
        radio.sendValue("calibrated2", 1)
    } else if (name == "reset") {
        isCalibrated = false
        running = false
        basic.clearScreen()
    } else if (name == "action") {
        running = true
    }
})
let score = 0
let time = 0
let degree = 0
let running = false
let isCalibrated = false
let calibratedRoll = 0
let calibratedPitch = 0
// Set radio group
radio.setGroup(10)
// Monitor and communicate
basic.forever(function () {
    if (running && isCalibrated) {
        degree = input.rotation(Rotation.Pitch)
        radio.sendValue("pitch2", degree)
        radio.sendValue("roll2", input.rotation(Rotation.Roll))
        radio.sendValue("ax2", input.acceleration(Dimension.X))
        radio.sendValue("ay2", input.acceleration(Dimension.Y))
        radio.sendValue("az2", input.acceleration(Dimension.Z))
        radio.sendValue("mx2", input.magneticForce(Dimension.X))
        radio.sendValue("my2", input.magneticForce(Dimension.Y))
        radio.sendValue("mz2", input.magneticForce(Dimension.Z))
        // Check for tilt
        if (Math.abs(degree - calibratedPitch) > 10 || Math.abs(input.rotation(Rotation.Roll) - calibratedRoll) > 10) {
            music.playTone(262, music.beat(BeatFraction.Whole))
        }
        // Check for incorrect alignment
        if (degree > 85 || degree <= 0) {
            time += 1
            if (time > 5) {
                music.playTone(262, music.beat(BeatFraction.Whole))
                score += 1
                radio.sendValue("score2", score)
            }
        } else {
            time = 0
        }
    }
})
