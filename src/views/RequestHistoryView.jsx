import React from 'react/addons';
import Immutable from 'immutable';
import {Link} from 'react-router';
import {Panel} from 'react-bootstrap';
import {PureView} from 'flux-rx';
import requestStore from '../stores/requestStore';
import Uri from 'urijs';

class RequestHistoryView extends PureView {
	constructor() {
		super();

		this.state = {
			requests: requestStore.history
		};
	}

	initialize(disposableStack) {
		disposableStack.push(requestStore.eventStream.subscribe(processRequests.bind(this)));
	}

	render() {
		var items = this.state.requests.map(item => {
				var className = '';
				if (item.method.toLowerCase() === 'get') {
					className = 'clickable';
				}

				var url = new Uri(item.href);

				return (
					<tr className={className} onClick={onClick.bind(this, item)}>
						<td className='method-col'>
							<span className='request-method'>{item.method}</span>
						</td>
						<td className='href-col'>
							<div className='href-col-path'>
								{url.resource()}
							</div>
							<div className='href-col-host'>
								{url.protocol() + '://' + url.host()}
							</div>
						</td>
					</tr>
				);
			}
		);

		return (
			<div className='request-history-view'>
				<Panel className='history-panel' header='History'>
					<table className='request-history-view-grid'>
						{items}
					</table>
				</Panel>
			</div>
		);
	}
}

function onClick(item) {
	if (item.method && item.method.toLowerCase() === 'get') {
		this.props.history.pushState(null, '/' + encodeURIComponent(item.href));
	}
}

function processRequests() {
	this.setState({
		requests: requestStore.history
	});
}

export default RequestHistoryView;
