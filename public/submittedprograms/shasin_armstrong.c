    /*

     * C Program to Check whether a given Number is Armstrong

     */

    #include <stdio.h>

    #include <math.h>
     

    int main()

    {

        int number, sum = 0, rem = 0, power= 0, temp,temp_new, num, count;

     printf ("enter a number");

       scanf("%d", &num);

        temp =temp_new= number;
        
        
        while(temp_new!=0)			//to calculate the number of terms
        {	count++;
			temp_new=temp_new/10;
	    }

        while (number != 0)

        {

          rem = number % 10;
          power = pow(rem, 3);
          sum = sum + power;
          number = number / 10;

        }

        if (sum == temp)
	

            printf ("The given no is armstrong no");

        else

            printf ("The given no is not a armstrong no");
	
	return 0;
    }
