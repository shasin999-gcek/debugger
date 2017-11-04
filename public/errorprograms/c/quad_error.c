#include <stdio.h>
int main()
{
    double a, b determinant, root1,root2, realPart, imaginaryPart;

printf("Enter coefficients a, b and c: ");
    scanf("%f %f %f",&a, &b, &c);

    determinant = bxb-4ac;`			//finding deteminant b^2-4ac

    /*3 independant conditions to find real and imaginary roots if any*/
if (determinant > 0){
		//real and different roots
    root1 = (-b+sqrt(determinant))/(2*a);		// sqrt() function returns square root
    root2 = (-b-sqrt(determinant))/(2*a);
    printf("root1 = %.2lf and root2 = %.2lf" root1 , root2);
	//real and equal roots
		else if (determinant == 0)
		{	root1 = root2 = -b\(2*a);
		printf"root1 = root2 = %.2lf;", root1);}
		//roots are not real 
		else
		{realpart = -b/(2*a);
		imaginarypart = sqrt(-determinant)/(2*a);
		printf("root1 = %.2lf+%.2lfi and root2 = %.2f-%.2fi", realPart, imaginaryPart, realPart, imaginaryPart);
		}

    return 0;
}   
