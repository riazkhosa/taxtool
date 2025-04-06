document.getElementById('lookup-btn').addEventListener('click', async () => {
  const postcode = document.getElementById('postcode').value.trim();
  if (!postcode) return alert("Enter a postcode");

  try {
    const response = await fetch('/api/lookup-postcode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postcode })
    });
    const data = await response.json();
    document.getElementById('council-name').textContent = data.localAuthority;
    document.getElementById('council-info').style.display = 'block';
  } catch (error) {
    alert("Postcode lookup failed");
  }
});

document.getElementById('calculate-btn').addEventListener('click', async () => {
  const authority = document.getElementById('council-name')?.textContent;
  const band = document.getElementById('tax-band').value;
  const singleOccupancy = document.getElementById('single-occupancy').checked;
  const studentHousehold = document.getElementById('student').checked;

  if (!authority) return alert("First lookup your postcode");

  try {
    const response = await fetch('/api/calculate-tax', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        authority, 
        band, 
        occupants: singleOccupancy ? 1 : 2, 
        discounts: { singleOccupancy, studentHousehold } 
      })
    });
    const data = await response.json();
    
    document.getElementById('annual-tax').textContent = data.annualTax.toFixed(2);
    document.getElementById('monthly-tax').textContent = data.monthlyTax;
    document.getElementById('results').style.display = 'block';
  } catch (error) {
    alert("Calculation failed");
  }
});

document.getElementById('download-pdf').addEventListener('click', () => {
  const annual = document.getElementById('annual-tax').textContent;
  const monthly = document.getElementById('monthly-tax').textContent;
  window.open(`/api/generate-pdf?annual=${annual}&monthly=${monthly}`, '_blank');
});
