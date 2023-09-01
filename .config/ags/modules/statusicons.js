const { Widget, Service } = ags;
const { exec, execAsync } = ags.Utils;
const { Audio, Battery, Bluetooth, Network } = ags.Service;

const BluetoothIndicator = () => Widget.Stack({
    items: [
        ['true', Widget.Label({ className: 'txt-norm icon-material txt', label: 'bluetooth' })],
        ['false', Widget.Label({ className: 'txt-norm icon-material txt', label: 'bluetooth_disabled' })],
    ],
    connections: [[Bluetooth, stack => { stack.shown = String(Bluetooth.enabled); }]],
});


const NetworkWiredIndicator = () => Widget.Stack({
    items: [
        ['unknown', Widget.Label({ className: 'txt-norm icon-material txt', label: 'wifi_off' })],
        ['disconnected', Widget.Label({ className: 'txt-norm icon-material txt', label: 'signal_wifi_off' })],
        ['disabled', Widget.Label({ className: 'txt-norm icon-material txt', label: 'signal_wifi_statusbar_not_connected' })],
        ['connected', Widget.Label({ className: 'txt-norm icon-material txt', label: 'lan' })],
        ['connecting', Widget.Label({ className: 'txt-norm icon-material txt', label: 'signal_wifi_0_bar' })],
    ],
    connections: [[Network, stack => {
        if (!Network.wired)
            return;

        const { internet } = Network.wired;
        if (internet === 'connected' || internet === 'connecting')
            stack.shown = internet;

        if (Network.connectivity !== 'full')
            stack.shown = 'disconnected';

        stack.shown = 'disabled';
    }]],
});

const NetworkWifiIndicator = () => Widget.Stack({
    items: [
        ['disabled', Widget.Label({ className: 'txt-norm icon-material txt', label: 'wifi_off' })],
        ['disconnected', Widget.Label({ className: 'txt-norm icon-material txt', label: 'signal_wifi_off' })],
        ['connecting', Widget.Label({ className: 'txt-norm icon-material txt', label: 'signal_wifi_statusbar_not_connected' })],
        ['4', Widget.Label({ className: 'txt-norm icon-material txt', label: 'signal_wifi_4_bar' })],
        ['3', Widget.Label({ className: 'txt-norm icon-material txt', label: 'network_wifi_3_bar' })],
        ['2', Widget.Label({ className: 'txt-norm icon-material txt', label: 'network_wifi_2_bar' })],
        ['1', Widget.Label({ className: 'txt-norm icon-material txt', label: 'network_wifi_1_bar' })],
        ['0', Widget.Label({ className: 'txt-norm icon-material txt', label: 'signal_wifi_0_bar' })],
    ],
    connections: [[Network,
        stack => {
            if (!Network.wifi)
                return;
            const { internet, enabled, strength } = Network.wifi;
            
            if(internet == 'connected') {
                stack.shown = String(Math.ceil(strength / 25));
            }
            else {
                stack.shown = 'disconnected'
            }
        }
    ]],
});

const NetworkIndicator = () => Widget.Stack({
    items: [
        ['wifi', NetworkWifiIndicator()],
        ['wired', NetworkWiredIndicator()],
    ],
    connections: [[Network, stack => {
        const primary = Network.primary || 'wifi';
        stack.shown = primary;
    }]],
});

export const StatusIcons = () => Widget.EventBox({
    child: Widget.Box({
        className: 'spacing-h-15',
        children: [
            Widget.Box({hexpand: true}),
            BluetoothIndicator(),
            NetworkIndicator(),
            Widget.Box({className: 'bar-sidespace'}),
        ]
    })
});

//function to convert celcius to fahrenheit
function celsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}