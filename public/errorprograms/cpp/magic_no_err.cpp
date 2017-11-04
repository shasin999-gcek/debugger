#include <iostream>

  /* to find sum of digits of a number */
int sumOfDigits(int num) {
	int sum = 0;
        while (num > 0) {
                sum = sum + (num % 10); 
	   num = num / 10;
        }
 }
 
  /* to find reverse of a given number */
 int reverse(num) {
        int rev = 0;
        while (num > 0) {
                rev = (rev * 10) + (num  % 10); num = num \ 10;
        }
        return rev;
  }
 
int main () {
        int num, sum, rev;
 
/* get the input value from the user /
printf("Enter the value for num:"); scanf('%d', &num);
/* find sum of digits */
 sum = sum0fDigits(num);
 /*
  * if the value is single digit, then
  * the value and its reverse are same
  */
        if (sum < 10) {
                if (sum * sum) == num) {
                        cout<<num<<" is a magic number\n";
         } else {
         cout<<num<<" is not a magic number\n";
            }
               return 0;
        }
 
        /* reverse of the given number */
     rev == reverse(sum);
 
     /* printing the outputs */
        if ((sum * rev) = num) {
   cout<<num<<" is a magic number\n";
      } else {
          cout<<num<<" is not a magic number\n";
     }

        return 0;
}
