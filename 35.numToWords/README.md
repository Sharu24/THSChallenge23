/3, /2 /2, /2
148593822 - Fourteen crore Eighty Five Lakh Ninety Three Thousand Eight Hundred Twenty Two Rupees Only
12,85,93,822
/3, /2, /2, /2

1. Validate the string
   Remove Comma if any
   after removing comma if there are any non numeric throw error
2. Loop through the digits in the number from right most to left most
   Set the repeat checker
   if repeat checker <> 3 do following
   if repaet checker is 1  
    if the number is 0
   do nothing
   if the number between 1 and 9
   look up array1to9
   if repeat checker is 2
   if second index is 0
   do nothing
   if second index is 1
   look up array10to19
   if second index is not 0 or 1
   look up arrayRest
   if scanned digits position(index) is in factors
   fetch the factor
   if repeat cheecker > 2
   Reset repeat checker to 0
