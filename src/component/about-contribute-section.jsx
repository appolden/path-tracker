import React, { Component } from 'react';

class AboutContributeSection extends Component {
  constructor(props) {
    super(props);

    this.state = { amount: undefined };
    this.onAmountChange = this.onAmountChange.bind(this);
  }

  getLanguage() {
    const language = (this.props.language || 'en').toLowerCase();
    switch (language) {
      case 'fr':
        return language;
        break;
      case 'en': // in case a user enters a language code that is not supported
      default:
        return 'en';
    }
  }

  onAmountChange(event) {
    this.setState({ amount: event.target.value });
  }

  render() {
    const language = this.getLanguage();
    let text = (
      <React.Fragment>
        <h2>Donate</h2>
        <p>
          If you like this app and would like to make a donation towards the
          running costs, please use the PayPal link below. It would be greatly
          appreciated. Thank you.
        </p>

        <form
          action="https://www.paypal.com/cgi-bin/webscr"
          method="post"
          target="_top"
        >
          <input type="hidden" name="cmd" value="_xclick" />
          <input type="hidden" name="business" value="a.polden@gmail.com" />
          <input type="hidden" name="currency_code" value="GBP" />
          <input
            type="hidden"
            name="item_name"
            value="GR10 Trail Tracker Contribution"
          />
          Amount:{' '}
          <input
            type="text"
            name="amount"
            value={this.state.amount}
            onChange={this.onAmountChange}
            placeholder="Enter Amount Here"
            style={{ witdh: '80px' }}
          />{' '}
          <input
            type="submit"
            src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/cc-badges-ppmcvdam.png"
            border="0"
            name="submit"
            alt="PayPal - The safer, easier way to pay online!"
            value="Donate"
          />
          <br />
          <img
            src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/cc-badges-ppmcvdam.png"
            alt="PayPal"
            style={{ marginTop: '10px' }}
          />
        </form>
      </React.Fragment>
    );

    switch (language) {
      case 'fr':
        text = (
          <React.Fragment>
            <h2>Faire un don</h2>
            <p>
              Si vous aimez cette application et que vous souhaitez faire un don
              pour les frais de fonctionnement, veuillez utiliser le lien PayPal
              ci-dessous. Ce serait vivement apprécié. Je vous remercie.
            </p>

            <form
              action="https://www.paypal.com/cgi-bin/webscr"
              method="post"
              target="_top"
            >
              <input type="hidden" name="cmd" value="_xclick" />
              <input type="hidden" name="business" value="a.polden@gmail.com" />
              <input type="hidden" name="currency_code" value="GBP" />
              <input
                type="hidden"
                name="item_name"
                value="GR10 Trail Tracker Contribution"
              />
              Amount:{' '}
              <input
                type="text"
                name="amount"
                value={this.state.amount}
                onChange={this.onAmountChange}
                placeholder="Entrez le montant ici"
                style={{ witdh: '80px' }}
              />{' '}
              <input
                type="submit"
                src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/cc-badges-ppmcvdam.png"
                border="0"
                name="submit"
                alt="PayPal - The safer, easier way to pay online!"
                value="Faire un don"
              />
              <br />
              <img
                src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/cc-badges-ppmcvdam.png"
                alt="PayPal"
                style={{ marginTop: '10px' }}
              />
            </form>
          </React.Fragment>
        );
        break;
      case 'en':
      default:
    }

    return <React.Fragment>{text}</React.Fragment>;
  }
}

export default AboutContributeSection;
