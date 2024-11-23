export const calculateCharges = (subtotal, charges) => {
  let total = subtotal;
  const breakdown = {};

  if (!charges || !Array.isArray(charges)) {
    return { total, breakdown };
  }

  charges.forEach(charge => {
    if (charge.isEnabled) {
      let chargeAmount = 0;
      
      if (charge.type === 'percentage') {
        chargeAmount = (subtotal * charge.value) / 100;
      } else {
        chargeAmount = charge.value;
      }

      breakdown[charge.name] = {
        type: charge.type,
        value: charge.value,
        amount: chargeAmount,
        description: charge.description
      };

      total += chargeAmount;
    }
  });

  return { total, breakdown };
}; 