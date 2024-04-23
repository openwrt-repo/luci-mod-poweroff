'use strict';
'require view';
'require rpc';
'require ui';
'require uci';

var callPoweroff = rpc.declare({
	object: 'system',
	method: 'poweroff',
	expect: { result: 0 }
});

return view.extend({
	load: function() {
		return uci.changes();
	},

	render: function(changes) {
		var body = E([
			E('h2', _('Poweroff')),
			E('p', { 'style': 'padding-left:1.5rem' }, _('Poweroff your device'))
		]);

		for (var config in (changes || {})) {
			body.appendChild(E('p', { 'class': 'alert-message warning' },
				_('Warning: There are unsaved changes that will get lost on shutting down!')));
			break;
		}

		body.appendChild(E('hr'));
		body.appendChild(E('button', {
			'class': 'cbi-button cbi-button-action important',
			'style': 'background:var(--danger) !important',
			'click': ui.createHandlerFn(this, 'handlePoweroff')
		}, _('Perform poweroff')));

		return body;
	},

	handlePoweroff: function(ev) {
		return callPoweroff().then(function(res) {
			if (res != 0) {
				L.ui.addNotification(null, E('p', _('The poweroff command failed with code %d').format(res)));
				L.raise('Error', 'Poweroff failed');
			}

			L.ui.showModal(_('Perform poweroff'), [
				E('p', { 'class': 'spinning' }, _('Waiting for device...'))
			]);

			window.setTimeout(function() {
				L.ui.showModal(_('Poweroff…'), [
					E('p', { 'class': 'spinning alert-message warning' },
						_('Device is shutting down!'))
				]);
			}, 150000);

			L.ui.awaitReconnect();
		})
		.catch(function(e) { L.ui.addNotification(null, E('p', e.message)) });
	},

	handleSaveApply: null,
	handleSave: null,
	handleReset: null
});
