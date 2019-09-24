import countData from './countData';

describe('test', () => {
  describe('request data proxy', () => {
    it('should return correct data', () => {
      expect(countData(['Paid', 'Paid'], 'ezicompare')).toEqual({
        appName: 'ezicompare',
        paid: 2,
        trial: 0,
        expired: 0,
        uninstalled: 0,
      });
      expect(
        countData(
          ['Paid', 'Paid', 'Trial', 'Uninstalled', 'Uninstalled', 'Expired'],
          'Negotiation',
        ),
      ).toEqual({
        appName: 'Negotiation',
        paid: 2,
        trial: 1,
        expired: 1,
        uninstalled: 2,
      });
    });
  });
});
