# Example Home Assistant Automations for Teams2HA

This file contains example automations you can use with the Teams2HA entities in Home Assistant.

## Prerequisites

Add these automations to your Home Assistant `configuration.yaml` or in the automations UI.

**Important:** The examples below use `binary_sensor.teams_in_meeting` as a placeholder. Replace `teams` with your actual hostname (lowercase, special characters replaced with underscores). For example, if your hostname is "DESKTOP-PC", use `binary_sensor.desktop_pc_in_meeting` instead.

## Example 1: Turn on "Do Not Disturb" Light When in Meeting

```yaml
automation:
  - alias: "Teams - Meeting Started"
    trigger:
      - platform: state
        entity_id: binary_sensor.teams_in_meeting
        to: "on"
    action:
      - service: light.turn_on
        target:
          entity_id: light.office_status_light
        data:
          color_name: red
          brightness: 255
      - service: notify.mobile_app
        data:
          message: "You are now in a Teams meeting"
```

## Example 2: Turn off Smart Home Sounds During Meetings

```yaml
automation:
  - alias: "Teams - Mute Notifications"
    trigger:
      - platform: state
        entity_id: binary_sensor.teams_in_meeting
        to: "on"
    action:
      - service: script.mute_all_media_players
      - service: input_boolean.turn_on
        target:
          entity_id: input_boolean.dnd_mode
```

## Example 3: Restore Settings After Meeting

```yaml
automation:
  - alias: "Teams - Meeting Ended"
    trigger:
      - platform: state
        entity_id: binary_sensor.teams_in_meeting
        to: "off"
        for: "00:01:00"  # Wait 1 minute to ensure meeting truly ended
    action:
      - service: light.turn_off
        target:
          entity_id: light.office_status_light
      - service: input_boolean.turn_off
        target:
          entity_id: input_boolean.dnd_mode
```

## Example 4: Announce When Camera is On

```yaml
automation:
  - alias: "Teams - Camera Status Change"
    trigger:
      - platform: state
        entity_id: binary_sensor.teams_camera_on
        to: "on"
    condition:
      - condition: state
        entity_id: binary_sensor.teams_in_meeting
        state: "on"
    action:
      - service: tts.google_translate_say
        data:
          entity_id: media_player.office_speaker
          message: "Camera is now on"
```

## Example 5: Change Lighting Based on Availability

```yaml
automation:
  - alias: "Teams - Availability Status Light"
    trigger:
      - platform: state
        entity_id: sensor.teams_availability
    action:
      - choose:
          - conditions:
              - condition: state
                entity_id: sensor.teams_availability
                state: "Available"
            sequence:
              - service: light.turn_on
                target:
                  entity_id: light.status_light
                data:
                  color_name: green
          - conditions:
              - condition: state
                entity_id: sensor.teams_availability
                state: "In Meeting"
            sequence:
              - service: light.turn_on
                target:
                  entity_id: light.status_light
                data:
                  color_name: red
          - conditions:
              - condition: template
                value_template: "{{ 'Muted' in states('sensor.teams_availability') }}"
            sequence:
              - service: light.turn_on
                target:
                  entity_id: light.status_light
                data:
                  color_name: orange
        default:
          - service: light.turn_off
            target:
              entity_id: light.status_light
```

## Example 6: Notify Family Members

```yaml
automation:
  - alias: "Teams - Notify Family"
    trigger:
      - platform: state
        entity_id: binary_sensor.teams_in_meeting
        to: "on"
    action:
      - service: notify.family_group
        data:
          message: "{{ state_attr('sensor.teams_availability', 'friendly_name') }} is now in a meeting"
```

## Example 7: Pause Media When Unmuting

```yaml
automation:
  - alias: "Teams - Pause Media When Unmuting"
    trigger:
      - platform: state
        entity_id: binary_sensor.teams_microphone_muted
        to: "off"
    condition:
      - condition: state
        entity_id: binary_sensor.teams_in_meeting
        state: "on"
    action:
      - service: media_player.media_pause
        target:
          entity_id: all
```

## Example 8: Log Meeting Statistics

```yaml
automation:
  - alias: "Teams - Log Meeting Duration"
    trigger:
      - platform: state
        entity_id: binary_sensor.teams_in_meeting
        to: "off"
    action:
      - service: logbook.log
        data:
          name: "Teams Meeting"
          message: "Meeting ended. Duration: {{ relative_time(trigger.from_state.last_changed) }}"
```

## Lovelace Dashboard Card Example

Add this to your Lovelace dashboard to display Teams status:

```yaml
type: entities
title: Teams Status
entities:
  - entity: sensor.teams_availability
    name: Availability
  - entity: binary_sensor.teams_in_meeting
    name: In Meeting
  - entity: binary_sensor.teams_camera_on
    name: Camera
  - entity: binary_sensor.teams_microphone_muted
    name: Microphone
  - entity: binary_sensor.teams_screen_sharing
    name: Screen Sharing
  - entity: binary_sensor.teams_recording
    name: Recording
```

## Conditional Card (Show Only When in Meeting)

```yaml
type: conditional
conditions:
  - entity: binary_sensor.teams_in_meeting
    state: "on"
card:
  type: vertical-stack
  cards:
    - type: markdown
      content: "## 🎥 You are in a meeting"
    - type: entities
      entities:
        - binary_sensor.teams_camera_on
        - binary_sensor.teams_microphone_muted
        - binary_sensor.teams_screen_sharing
```

## Tips

1. Replace entity IDs with your actual entity IDs
2. Test automations carefully before relying on them
3. Consider adding conditions to prevent false triggers
4. Use delays to handle quick state changes
5. Combine multiple conditions for more complex scenarios
