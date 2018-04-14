import React from 'react'

const Checkbox = () => (
  <div>
    <div>
      <div>
        <form
          id="registrationForm"
          className="form-horizontal fv-form fv-form-bootstrap"
          noValidate="novalidate"
          style={{ marginTop: 15 }}
        >
          <button type="submit" />

          <div>
            <h3>Welcome to PowerPiper!</h3>
            <div>
              <div>
                <h3><b>Instructions:</b></h3>

                <br />

                <p>In order to use this application you need a Metamask
                  account and being connected to<br />
                  Rinkeby Test Network instead of Main net.<br />
                  </p>

                  <h4>Please Follow the Next Steps in Order to Use Metamask:</h4>

                <br />

                <p><strong>1: </strong>
                  Download and install <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">Metamask</a> extension.<br />
                </p>
                <p><font size="3"><b>2: </b></font>
                  Connect to Rinkeby Test Net by clicking the top right arrow and selecting
                  <b>Rinkeby Test Network.</b>
                </p>
                <p><strong>3: </strong>
                  Now that you are connected into Rinkeby Test Network you need some Rinkeby Ether. Fortunately, you can get it for free just by completing a social network <a href="https://faucet.rinkeby.io/" target="_blank" rel="noopener noreferrer">challenge</a>.
                  Now you are ready to use Platform.
                </p>

                <br />

                <label>
                  Performing an Action:
                </label>
                <br />

                <p><strong>1-</strong>
                  For each time you perform an action inside Platform; a Metamask transaction will be created.
                </p>
                <p><strong>2:</strong>
                  Click <b>Submit</b> to send the transaction, then
                  the order will reach the PowerPiper Bard and they will need to approve it,
                  this normally takes 24 hours after you have submitted it.
                </p>
                <p><strong>3:</strong>
                  After your order has been approved, your balance will automatically be
                  reflected into your account.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <br />

    <div>
      <div>
        <a href='/app'>
          Start
        </a>
      </div>

      <br />

      <div>
        <a href="https://faucet.rinkeby.io/" target="_blank" rel="noopener noreferrer">Get Rinkeby Ether</a>
      </div>
    </div>
  </div>
)

export default Checkbox
