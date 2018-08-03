const { assertRevert } = require('./utils/helpers');

const TokenTimelockPool = artifacts.require('./TokenTimelockPool.sol');
const Wibcoin = artifacts.require('../test/utils/Wibcoin.sol');

contract('TokenTimelockPool', (accounts) => {
  const owner = accounts[0];
  const releaseDate = Date.now() / 1000 + 60 * 60 * 24;

  const beneficiary1 = accounts[1];
  const beneficiary1Amount = 1000;
  const beneficiary2 = accounts[2];
  const beneficiary2Amount = 1500;
  const beneficiary3 = accounts[3];
  const beneficiary3Amount = 2000;
  const totalFunds = beneficiary1Amount + beneficiary2Amount + beneficiary3Amount;

  let token;
  let tokenTimelockPool;
  beforeEach(async () => {
    token = await Wibcoin.new({ from: owner });
    tokenTimelockPool = await TokenTimelockPool.new(token.address, totalFunds, releaseDate, {
      from: owner,
    });
  });


  describe('#constructor', () => {
    it('instantiates the contract', async () => {
      const contract = await TokenTimelockPool.new(token.address, 1000, releaseDate, {
        from: owner,
      });
      assert(contract, 'TokenTimelockPool could not be instantiated');
    });

    it('does not instantiate the contract when the caller is not the owner', async () => {
      try {
        await TokenTimelockPool.new(token.address, 1000, releaseDate, { from: accounts[1] });
        assert.fail();
      } catch (error) {
        assertRevert(error);
      }
    });

    it('does not instantiate the contract when the token is not a valid address', async () => {
      try {
        await TokenTimelockPool.new('0x0', 1000, releaseDate, { from: owner });
        assert.fail();
      } catch (error) {
        assertRevert(error);
      }
    });

    it('does not instantiate the contract when the token is not an ERC20 token', async () => {
      try {
        await TokenTimelockPool.new(accounts[1], 1000, releaseDate, { from: owner });
        assert.fail();
      } catch (error) {
        assertRevert(error);
      }
    });

    it('does not instantiate the contract when the allowed spending is zero', async () => {
      try {
        await TokenTimelockPool.new(token.address, 0, releaseDate, { from: owner });
        assert.fail();
      } catch (error) {
        assertRevert(error);
      }
    });

    it('does not instantiate the contract when the allowed spending is less than zero', async () => {
      try {
        await TokenTimelockPool.new(token, -1, releaseDate, { from: owner });
        assert.fail();
      } catch (error) {
        assertRevert(error);
      }
    });

    it('does not instantiate the contract when the release date is now', async () => {
      try {
        await TokenTimelockPool.new(token.address, 1000, (Date.now() / 1000), { from: owner });
        assert.fail();
      } catch (error) {
        assertRevert(error);
      }
    });

    it('does not instantiate the contract when the release date is in the past', async () => {
      try {
        await TokenTimelockPool.new(token.address, 1000, (releaseDate - 100000), { from: owner });
        assert.fail();
      } catch (error) {
        assertRevert(error);
      }
    });
  });


  describe('#addBeneficiary', () => {
    it('adds a beneficiary to the token pool', async () => {
      await tokenTimelockPool.addBeneficiary(beneficiary1, beneficiary1Amount);
    });

    it('adds a beneficiary when the beneficiary already exists in the pool', async () => {
      await tokenTimelockPool.addBeneficiary(beneficiary1, beneficiary1Amount);
      await tokenTimelockPool.addBeneficiary(beneficiary1, beneficiary1Amount);
    });

    it('does not add a beneficiary when the beneficiary is not a valid address', async () => {
      try {
        await tokenTimelockPool.addBeneficiary('0x0', beneficiary1Amount);
        assert.fail();
      } catch (error) {
        assertRevert(error);
      }
    });

    it('does not add a beneficiary when the beneficiary is the owner of the pool', async () => {
      try {
        await tokenTimelockPool.addBeneficiary(owner, beneficiary1Amount);
        assert.fail();
      } catch (error) {
        assertRevert(error);
      }
    });

    it('does not add a beneficiary when amount of tokens is zero', async () => {
      try {
        await tokenTimelockPool.addBeneficiary(beneficiary1, 0);
        assert.fail();
      } catch (error) {
        assertRevert(error);
      }
    });

    it('does not add a beneficiary when amount of tokens is more than the pool balance', async () => {
      try {
        await tokenTimelockPool.addBeneficiary(beneficiary1, totalFunds + 1);
        assert.fail();
      } catch (error) {
        assertRevert(error);
      }
    });
  });


  describe('#getDistributionContracts', () => {
    it.skip('returns the distribution contracts for a given beneficiary', async () => {
    });

    it.skip('returns null if beneficiary has not been added', async () => {
    });

    it.skip('does not return the distribution contracts if beneficiary is not a valid address', async () => {
    });
  });
});