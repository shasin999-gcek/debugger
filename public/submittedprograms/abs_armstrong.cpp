/* C++ PROGRAM TO CHECK WHETHER A NUMBER IS ARMSTRONG OR NOT */

#include <iostream>
#include <math.h>
using namespace std;

int main()
{
  int temp,temp_new, number, rem=0, sum = 0, num, count;
  cout << "Enter a positive  integer: ";
  cin >> num;

  temp=temp_new=number;
  
   while(temp_new!=0)			//to calculate the number of terms
   {
		count++;
		temp_new=temp_new/10;
   }

  while(number != 0)						
  {									//calculate sum of powers of digits
      rem = number % 10;
      sum += pow(rem,3);
      number /= 10;
  }

		if(sum == temp)
			cout << temp << " is an Armstrong number.";
		else
			cout << temp << " is not an Armstrong number.";
  
  return 0;
}
