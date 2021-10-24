! MXNFFT:  Maximum power of 2 for transform size
! MAXPTS:  Maximum size of arrays for the real and imaginary fields
      
      integer*4 maxpts, maxnfft
      parameter ( maxnfft = 10)
      parameter ( maxpts = 2**maxnfft ) 
! REMEMBERER ALSO TO UPDATE THESE VARIABLE IN TPEM.INC
