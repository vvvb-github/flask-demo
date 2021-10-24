module pemod

	real( kind=8 ) pi
	parameter ( pi = 3.1415926535897932d0 )    !Self-explanatory

!	common / pevar / freq, antht, bw, elv, wl, fko, con, delz, zmax, &
!				 delp, fnorm, cnst, rmax, dr, ipat, ln, n, nm1, no4, n34, n75

	real( kind=8 ) freq, antht, bw, elv, wl, fko, con, delz, zmax, delp, &
				   fnorm, cnst, rmax, dr,free,a
	integer( kind=4 ) ipat, ln, n, nm1, no4, n34, n75, nrout


	real(kind=8), allocatable :: filt(:), ht(:), ref(:), mloss(:)
	public :: filt, ht, ref, mloss

	complex(kind=8), allocatable :: u(:), frsp(:), envpr(:), pobs(:,:), ulst(:)
	public :: u, frsp, envpr, pobs, ulst

! CONSTANT
	real( kind=8 ) c0, radc, gamma
	complex( kind=8 ) qi

	data c0 / 299.79245d0 /				! speed of light x 1e.-6 m/s
	data radc / 1.74533d-2 /			! degree to radian conversion factor
	data qi / (0.d0, 1.d0) /			! Imaginary i
	data gamma / 0.01d0 /

end module


subroutine SPE(aa,bb,cc,dd,ee,xxx)

	use pemod
    !pemod 抛物线方程
	implicit integer(kind=4) (i-n)
	implicit real(kind=8) (a-h, o-z)
	real(kind=4)::aa,bb,cc,dd,ee
	real,intent(out)::xxx(200,200)


	! 雷达系统参数和大气折射率廓线
	! 采用Gerstoft et al. [2003, Radio Sci.] 文献中的数据
	rmax = 100.
	rmax = rmax * 1.d3
	nrout = 200
	dr = rmax/dble(nrout)
   ! write(*,*)aa,bb,cc,dd,ee

	! 雷达系统参数，默认极化方式为水平极化
	freq = 7000.	! 发射频率，单位MHz
	antht = 600		! 天线高度，单位m
	ipat = 2		! 天线类型
	bw = 16			! 波束宽度，单位deg
	elv = 1.		! 发射仰角，单位deg

	wl = c0 / freq
	fko = 2.d0 * pi / wl
	!波数
	con = 1.e-6 * fko

   !初始化Fourier变换变量
	call getfftsz

	delp = pi / zmax	! determined by Nyquist theorem
	fnorm = 2. / n		! Fourier变换中的归一化系数
	cnst = delp / fko	! 用来确定自由空间相位因子(phase factors)
	nm1 = n - 1

	! Initialize variables and set-up filter array.
	no4 = n / 4
	n34 = 3. *  no4
	cn75 = 4. * pi / n

	if( allocated( filt ) ) deallocate( filt, stat=ierror )
	allocate( filt(0:no4), stat=ierror )
	if( ierror .ne. 0 ) stop
	filt = 0.d0

	filt = .5 + .5 * dcos( (/(i, i=0, no4)/) * cn75 ) !滤波函数

	call allarray

	do i = 0, n
		ht(i) = dble(i) * delz
	end do

     call MM(aa,bb,cc,dd,ee)  !根据五参数确定折射率

	! Initialize starter field
	call xyinit(ROUT)	! rout记录输出距离
	call fft(u)			! transform to z-space
	pobs(:,0) = u

	call phase1
	call phase2

    free=20 * log10(2*fko)

!    open(15,file='40.out')

	do i = 1, nrout
		call pestep( rout )
		pobs(:,i) = u

		do j = 1,200
		    xxx(j,i)=10.*log10(rout/1000)+free-20.*log10(abs(pobs(j,i))) !传播损耗
		end do
	end do

!	close(15)


end subroutine

!#################################################################################################
subroutine allarray

	use pemod

	implicit integer(kind=4) (i-n)
	implicit real(kind=8) (a-h, o-z)

	ierror = 0

	if( allocated( ht ) ) deallocate( ht, stat=ierror )
	allocate( ht(0:n), stat=ierror )
	if( ierror .ne. 0 ) return
	ht = 0.d0

	if( allocated( ref ) ) deallocate( ref, stat=ierror )
	allocate( ref(0:n), stat=ierror )
	if( ierror .ne. 0 ) return
	ref = 0.d0

	if( allocated( mloss ) ) deallocate( mloss, stat=ierror )
	allocate( mloss(0:n), stat=ierror )
	if( ierror .ne. 0 ) return
	mloss = 0.d0


	if( allocated( u ) ) deallocate( u, stat=ierror )
	allocate( u(0:n), stat=ierror )
	if( ierror .ne. 0 ) return
	u = cmplx( 0., 0., 8 )

	if( allocated( frsp ) ) deallocate( frsp, stat=ierror )
	allocate( frsp(0:n), stat=ierror )
	if( ierror .ne. 0 ) return
	frsp = cmplx( 0., 0., 8 )

	if( allocated( envpr ) ) deallocate( envpr, stat=ierror )
	allocate( envpr(0:n), stat=ierror )
	if( ierror .ne. 0 ) return
	envpr = cmplx( 0., 0., 8 )

	if( allocated( pobs ) ) deallocate( pobs, stat=ierror )
	allocate( pobs(0:n,0:nrout), stat=ierror )
	if( ierror .ne. 0 ) return
	pobs = cmplx( 0., 0., 8 )

 !   if( allocated( xxx ) ) deallocate( xxx, stat=ierror )
!	allocate( xxx(0:n,0:nrout), stat=ierror )
!	if( ierror .ne. 0 ) return
!	xxx = ( 0., 0. )

	if( allocated( ulst ) ) deallocate( ulst, stat=ierror )
	allocate( ulst(0:n), stat=ierror )
	if( ierror .ne. 0 ) return
	ulst = cmplx( 0., 0., 8)

	return

end subroutine
!#############################################################################################
! Purpose: Determines the antenna pattern factor for angle passed to routine

subroutine antpat( sang, patfac )

	use pemod

	implicit integer(kind=4) (i-n)
	implicit real(kind=8) (a-h, o-z)

	common /pattern/ pelev, afac, umax, sbw

!	In the following pattern definitions, "ua" refers to the angle for which
!	the antenna pattern is sought, and "u0" refers to the elevation angle.
!	ipat = 0 gives Omnidirectional antenna pattern factor : f(ua) = 1

	patfac = 1. !antenna pattern factor

	if( ipat .gt. 1 ) then			!ipat=type of antenna pattern.
		ua = dasin( sang )
		udif = ua - elv				!alpha_pat=alpha-miu_or
	end if

!	ipat = 1 gives Gaussian antenna pattern based on
!	f(p-p0) = exp(-w**2 * ( p-p0 )**2 ) / 4, where p = sin(ua) and p0 = sin(u0)

	if( ipat .eq. 1 ) then
		pr = sang - pelev
		patfac = dexp( -pr * pr * afac ) !afac=the antenna factor

!	ipat = 2 gives sin(x)/x pattern based on
!	f(ua-u0) = sin(x) / x where x = afac * sin(ua-u0) for |ua-u0| <= umax
!	f(ua-u0) = .03 for |ua-u0| > umax
!	ipat = 4 gives height-finder pattern which is a special case of sin(x)/x

	elseif (( ipat .eq. 2 ) .or. ( ipat .eq. 4 )) then
		if( ipat .eq. 4 ) then
			dirang = dabs( sang )  !dirang:sine of direct ray angle
			if( dirang .gt. elv ) udif = ua - dirang
		end if

		if( dabs(udif) .le. 1.e-6 ) then
			patfac = 1.
		elseif( dabs( udif ) .gt. umax ) then
			patfac = .03
		else
			arg = afac * dsin( udif )
			patfac = dmin1( 1., dmax1( .03, dsin( arg ) / arg ) )
		end if

!	ipat = 3 gives csc-sq pattern based on
!	f(ua) = 1 for ua-u0 <= bw
!	f(ua) = sin(bw) / sin(ua-u0) for ua-u0 > bw
!	f(ua) = maximum of .03 or [1+(ua-u0)/bw] for ua-u0 < 0

	elseif( ipat .eq. 3 ) then
		if( udif .gt. bw ) then
			patfac = sbw / dsin( udif )
		elseif( udif .lt. 0 ) then
			patfac = dmin1( 1., dmax1( .03, (1. + udif / bw) ) )
		end if
	end if

	return

end subroutine
!#############################################################################################
subroutine fft( udum )

	use pemod

	implicit integer(kind=4) (i-n)
    implicit real(kind=8) (a-h, o-z)
	include 'fftsiz.inc'

	complex( kind=8 ) udum(0:*)

	dimension x(0:maxpts), y(0:maxpts)

	do i = 0, n
		x(i) = real( udum(i) )
		y(i) = imag( udum(i) )
	end do

	call sinfft( ln, x )
	call sinfft( ln, y )

	do i = 0, n
		udum(i) = cmplx( x(i), y(i), 8 )
	end do

	return

end
!################################################################################################
subroutine getfftsz

	use pemod

	implicit integer(kind=4) (i-n)
	implicit real(kind=8) (a-h, o-z)

	! 为了计算方便，这里直接定义相关变量的值，并使之满足Nyquist定理

	delz = 2.
	ln = 10
	n = 2**ln
	zmax = delz * dble(n)

	return

end
!#################################################################################################
subroutine pestep( rout )

	use pemod

	implicit integer(kind=4) (i-n)
	implicit real(kind=8) (a-h, o-z)

	save r

	if( rout .le. 1.e-3 ) r = 0
	rout = rout + dr

	rlast = r
	ulst = u

	r = r + dr
 !   write(*,*)rmax,r
	!  TRANSFORM TO FOURIER SPACE
	call fft( u )

	!  Multiply by free-space propagator.
	u = u * frsp

	!  TRANSFORM BACK TO Z-SPACE
	call fft( u )

	! Multiply by environment term.
	u = u * envpr

!	do i = 0, n
!		write(*,*) u(i)
!	end do

	return
end subroutine
!#############################################################
! Purpose: Initialize free-space propagator array FRSP() using narrow-angle propagator

! Local Variables:
!	AK = Term used in ANG for each bin, i.e., I*DELP
!	AKSQ = Square of AK
!	ANG = Exponent term: ANG = -i * dr * (p**2)/(2*k0), where k is the free-space wavenumber,
!						 p is the transform variable (p=k*sin(theta)),
!	ATTN = Attenuation factor for filtering


! Reference: AD-A248112, Frank J. Ryan, 1991

subroutine phase1

	use pemod

	implicit integer(kind=4) (i-n)
	implicit real(kind=8) (a-h, o-z)

	double precision cak

	do i = 0, n
		ak = dble(i) * delp
		aksq = ak * ak
		ang = aksq * dr / ( 2.d0 * fko )
		ca = dcos( ang )
		sa = -dsin( ang )
		frsp(i) = fnorm * cmplx( ca, sa, 8) !作Fourier逆变换，乘以系数fnorm
	end do

	! Filter the upper 1/4 of the propagator arrays.
	frsp(n34:n) = filt(0:no4) * frsp(n34:n)

!	do i = 0, n
!		write(30,*) dble(i) * delp, frsp(i)
!	end do

	return

end
!############################################################################
! Purpose: Calculates the environmental phase term for a given profile,
!		   then stores in the array envpr().

subroutine phase2

	use pemod

	implicit integer(kind=4) (i-n)
	implicit real(kind=8) (a-h, o-z)
	real(kind=8):: m

	do i = 0, n
		m = 1 + ref(i)*1.d-6
	!	write(*,*)m
		m = m*m
		ang = fko * ( m - 1.d0 ) * dr / 2.d0
		ca = dcos( ang )
		sa = dsin( ang )
		envpr(i) = cmplx( ca, sa, 8 )

	end do

	! Filter upper 1/4 of the arrays.
	envpr(n34:n) = filt(0:nf4) * envpr(n34:n)

!	do i = 0, n
!		write(30,*) i, envpr(i)
!	end do

	return

end
!!!!!!!#################################################################
subroutine xyinit( ROUT )

	use pemod

	implicit integer(kind=4) (i-n)
	implicit real(kind=8) (a-h, o-z)

	common /pattern/ pelev, afac, umax, sbw

	complex(kind=8):: refcoef, rterm, dterm

! Reflection coefficient is defaulted to -1 for horizontal polarization.

	refcoef = dcmplx(-1., 0.)	! complex reflection coefficient
	sgain = dsqrt(WL) / zmax	!the normalization factor 归一化因子
	dtheta = delp / fko			!the angle difference between mesh points in p-space
	antko = fko * antht			!the height-gain value at the source发射天线处的高度增益值

!	write(*,*) wl, zmax, sgain, delp, fko, dtheta, antht, antko, refcoef

!	Calculate constants used to determine antenna pattern factor
!		IPAT = 0 -> omni
!		IPAT = 1 -> gaussian
!		IPAT = 2 -> sinc x
!		IPAT = 3 -> csc**2 x
!		IPAT = 4 -> generic height-finder

	bw = bw * radc			!convert degree to arc
	elv = elv * radc
	bw2 = .5 * bw


	if( ipat .eq. 1 ) then
		afac = .34657359 / (dsin( bw2 ))**2 ! constant used in determining
	                                        ! antenna pattern factors
		pelev = dsin( elv )                 ! sine of elevation angle
	elseif( ipat .eq. 3 ) then
		sbw = dsin( bw )                    !sine of the beamwidth
	elseif( ipat .ne. 0 ) then
		afac = 1.39157 / dsin( bw2 )
		a = pi / afac
		umax = datan( a / dsqrt(1. - a**2)  )
	end if

	do I=1,N
		pk = dble(i) * dtheta	!the direct-path ray elevation angle
		zpk = pk * antko

!		Get antenna pattern factors for the direct and reflected rays.
		call antpat( pk, FACD )
		call antpat( -pk, FACR )

		rterm = dcmplx( dcos( zpk ), dsin( zpk ) )
		dterm = dconjg( rterm ) !共轭

		u(i) = sgain * ( facd * dterm + refcoef * facr * rterm )

	end do

	! Filter upper 1/4 of the field.
	do i = n34, n
		attn = filt( i-n34 )
		u(i) = attn * u(i)		!给定的初始场在p空间
	end do

!	do i = 0, n
!		write(30,*) dble(i)*dtheta, u(i)
!	end do

	rout = 0

	return

end



   subroutine MM(c1,zb,m,zt,q)
        use pemod
		implicit none

		!m:负折射指数, zt:陷获层厚度, c1:混合层斜率, zb:陷获层底厚度, q:蒸发波导厚度
		real:: m,zt,c1,zb,height,MMM,M1,zi,q
		integer i
 !       write(*,*)m,zt,c1,zb,q
 !五参数确定折射率廓线
      do i=1,n
	      height=ht(i)
		  if (height==0) then
		     MMM=392.8
		  else if(height>0 .and. height<=(2*q)) then
		     M1=0.13*q*log(2*q/0.00015)+2*q*(c1-0.13)
            MMM=392.8+M1+0.13*(height-q*log(height/0.00015))
		  else if(height>(2*q) .and. height<=zb) then
            MMM=392.8+c1*height
		  else if( height>zb .and. height<=(zb+zt)) then
		     MMM=392.8+c1*zb-m*(height-zb)/zt
		  else if(height>(zb+zt)) then
		     MMM=392.8+c1*zb-m+0.118*(height-zb-zt)
		  end if
		     ref(i)=MMM
	   end do

   end subroutine

         SUBROUTINE sinfft(N,X)

      !***********************************************************************

      !Obtained from:
      ! Dan Dockery
      ! APL - Johns Hopkins Univ.
      ! Baltimore, MD

      !With minor code modifications by:
      ! Amalia Barrios
      ! SPAWARSYSCEN D858
      ! San Diego, CA

      !     DRST REPLACES THE REAL*8 VECTOR X BY ITS FINITE DISCRETE SINE OR C
      !     TRANSFORM.  THE ALGORITHM IS BASED ON A MIXED RADIX (8-4-2)
      !     REAL VECTOR FAST FOURIER SYNTHESIS ROUTINE PUBLISHED BY
      !     (G. D. BERGLAND, "A RADIX-EIGHT FAST FOURIER TRANSFORM SUBROUTINE
      !	FOR REAL-VALUED SERIES," IEEE TRANSACTIONS ON AUDIO AND ELECTRO-
       !     ACOUSTICS, VOL. AU-17, PP. 138-144, JUNE 1969) AND SINE AND COSINE
      !     TRANSFORM ALGORITHMS PUBLISHED BY COOLEY, LEWIS, AND WELSH
      !     (J. W. COOLEY, P. A. W. LEWIS AND P. D. WELSH, "THE FAST FOURIER
      !     TRANSFORM ALGORITHM PROGRAMMING CONSIDERATIONS IN THE CALCULATION
      !     OF SINE, COSINE AND LAPLACE TRANSFORMS," J. EM VIB., VOL. 12,
      !     PP. 315-337, JULY 1970).

      !     NOTE:  CALLS FOR THE SINE TRANSFORM RETURN THE DISCRETE ANALOG
      !            OF -1 TIMES THE SINE TRANSFORM INTEGRAL


      !          MODIFIED JULY 1983 BY J. P. SKURA

      !-----------------------------------------------------------------------
      !                           INPUT PARAMETERS

      !        X     A 2**N+1 REAL*8 ARRAY FOR THE TRANSFORM

      !        N     TRANSFORM SIZE

      !      IFLAG   FLAG TO SIGNIFY WHICH TRANSFORM TO PERFORM
      !                       IFLAG=0 FOR COSINE TRANSFORM
      !                       IFLAG=1 FOR  SINE  TRANSFORM
      !                       iflag = -1 deallocates all allocated arrays

      !-----------------------------------------------------------------------

      !                          OUTPUT PARAMETERS

      !        X      A 2**N+1 POINT REAL*8 ARRAY OF THE TRANSFORMED DATA

      !        N      TRANSFORM SIZE (UNCHANGED)

      !      IFLAG    UNCHANGED

      !-----------------------------------------------------------------------



      !     TABLES - ARRAY   REQUIRED DIMENSIONS
      !               B         2**N + 1
      !               ST        2**N
      !               JI        2**(N-1) - 1
      !               CS        2**(N-4) - 1
      !               SS        2**(N-4) - 1
      !
      !     SUBROUTINES - DR8SYN (RADIX 8 SYNTHESIS)
      !                   DR4SYN (RADIX 4 SYNTHESIS)
      !                   DR2TR  (RADIX 2 TRANSFORM)

      !***********************************************************************

      implicit integer(kind=4) (i-n)
      implicit real(kind=8) (a-h, o-z)

      DIMENSION X(*)

      double precision, allocatable :: b(:), st(:), cs(:), ss(:)
      integer(kind=4), allocatable :: ji(:)

      save n2, n4, n8, np, npd2, npd4, npd16, npm1, nmax2, nmax16
      save b, st, cs, ss, ji

      DATA N2 / 0 /

      PI = 4.d0 * datan(1.d0)		! Zhao
      IFLAG=1
      IF(( N.NE.N2 ) .and. ( iflag .ge. 0 )) then

       N2=N
       NP=2**N2
       nmax2 = np / 2
       nmax16 = np / 16

       if( allocated ( b ) ) deallocate ( b )
       allocate ( b(np+1) )
       b = 0.

       if( allocated ( ji ) ) deallocate ( ji )
       allocate ( ji(nmax2) )
       ji = 0

       if( allocated ( st ) ) deallocate ( st )
       allocate ( st(np) )
       st = 0.

       if( allocated ( cs ) ) deallocate ( cs )
       allocate ( cs(nmax16) )
       cs = 0.

       if( allocated ( ss ) ) deallocate ( ss )
       allocate ( ss(nmax16) )
       ss = 0.

      !     COMPUTE CONSTANTS AND CONSTRUCT TABLES

       N8=N2/3
       N4=N2-3*N8-1
       NPD2=NP/2
       NPD4=NP/4
       NPD16=NP/16
       NPM1=NP-1
       DT=PI/dble(NP)

       ST(1)=0.0
       DO J=1,NPM1
          T=DT*dble(J)
          ST(J+1)=0.5d0/DSIN(T)
       end do

      !     CONSTRUCT THE BIT REVERSED SUBSCRIPT TABLE.

       J1=0

       NT=NPD2-1
       DO J=1,NT
          J2=NPD2
          do while (IAND(J1,J2).NE.0)
             J1=IABS(J1-J2)
             J2=J2/2
          end do
          J1=J1+J2
          JI(J)=J1
       end do

       IF (N8.NE.0) then

      !     CONSTRUCT THE TRIGONOMETRIC TABLES FOR THE RADIX 8 PASSES.
      !     THE TABLES ARE STORED IN BIT REVERSED ORDER.

          J1=0
          NT=NPD16-1
          DO J=1,NT
             J2=NPD16
             do while (IAND(J1,J2).NE.0)
                J1=IABS(J1-J2)
                J2=J2/2
             end do
             J1=J1+J2
             T=DT*dble(J1)
             CS(J)=DCOS(T)
             SS(J)=-DSIN(T)
          end do
       end if

      elseif( iflag .eq. -1 ) then

      !End of APM run - deallocate arrays and return to main driver program.

          if( allocated( b ) ) deallocate( b, stat = ierror )
          if( allocated( st ) )deallocate( st, stat = ierror )
          if( allocated( cs ) )deallocate( cs, stat = ierror )
          if( allocated( ss ) )deallocate( ss, stat = ierror )
          if( allocated( ji ) )deallocate( ji, stat = ierror )
          n2 = 0
          return

      end if

      IF (IFLAG.GT.0) then

      !     SET UP ARRAY FOR THE SINE TRANSFORM

       B(1)=-(X(2)+X(2))
       B(2)=X(NP)+X(NP)

       J1=0
       DO J=3,NPM1,2
          J1=J1+1
          J2=JI(J1)
          J3=NP-J2
          B(J)=X(J2)-X(J2+2)
          B(J+1)=X(J3+1)
       end do

      else

      !     SET UP THE ARRAY FOR THE COSINE TRANSFORM

       B(1)=X(1)
       B(2)=X(NP+1)
       J1=0
       XSUM=X(2)
       DO J=3,NPM1,2
          J1=J1+1
          J2=JI(J1)
          J3=NP-J2
          XSUM=XSUM+X(J+1)
          B(J)=X(J2+1)
          B(J+1)=X(J3+2)-X(J3)
       end do

      end if

      !     BEGIN FAST FOURIER SYNTHESIS

      IF (N8.ne.0) then

      !     RADIX 8 ITERATIONS

       IQNT=1
       NT=NPD16
       DO J=1,N8
          J1= 1+IQNT
          J2=J1+IQNT
          J3=J2+IQNT
          J4=J3+IQNT
          J5=J4+IQNT
          J6=J5+IQNT
          J7=J6+IQNT
         CALL DR8SYN(IQNT,nt,cs,ss,B,B(J1),B(J2),B(J3),B(J4),B(J5),B(J6),B(J7))
          NT=NT/8
          IQNT=8*IQNT
       end do
      end if

      if( n4 .gt. 0 ) then

      !     RADIX 4 ITERATION

       IQNT=NPD4
       J1= 1+IQNT
       J2=J1+IQNT
       J3=J2+IQNT
       CALL DR4SYN(IQNT,B,B(J1),B(J2),B(J3))

      elseif( n4 .eq. 0 ) then

      !     RADIX 2 ITERATION

       IQNT=NPD2
       J1= 1+IQNT
       CALL DR2TR(IQNT,B,B(J1))

      end if

      J1=NP

      IF (IFLAG.GT.0) then

      !     FORM SINE TRANSFORM

       DO J=2,NPD2
         S=B(J1)-B(J)
         T=B(J)+B(J1)
         X(J)=0.25*(T*ST(J)+S)
         X(J1)=0.25*(T*ST(J1)-S)
         J1=J1-1
       end do
       IQNT=NPD2+1
       X(IQNT)=0.25*(ST(IQNT)*(B(IQNT)+B(IQNT)))
       X(1)=0.0
       X(NP+1)=0.0

      else

      !     FORM THE COSINE TRANSFORM

       X(1)=.5d0*B(1)+XSUM
       X(NP+1)=.5d0*B(1)-XSUM
       B(1)=B(1)+XSUM
       B(NP+1)=B(1)-XSUM
       DO J=2,NPD2
         S=B(J1)-B(J)
         T=B(J)+B(J1)
         X(J)=.25d0*(S*ST(J)+T)
         X(J1)=.25d0*(T-S*ST(J1))
         J1=J1-1
       end do

       IQNT=NPD2+1
       X(IQNT)=0.25d0*(B(IQNT)+B(IQNT))

      end if

      RETURN
      END subroutine sinfft

      SUBROUTINE DR8SYN(IQNT, nt, cs, ss, B0,B1,B2,B3,B4,B5,B6,B7)
      !****************************************************************
      !
      !     RADIX 8 SYNTHESIS SUBROUTINE
      !     CALLED BY DRST, THE SINE TRANSFORM DRIVER.
      !
      !****************************************************************

      implicit integer(kind=4) (i-n)
      implicit real(kind=8) (a-h, o-z)

      DIMENSION B0(*),B1(*),B2(*),B3(*),B4(*),B5(*),B6(*),B7(*)
      dimension cs(*), ss(*)

      DATA R2,CPI4/1.41421356237309505d0,0.7071067811865476d0/
      DATA CPI8,SPI8/0.9238795325112868d0,0.3826834323650898d0/

          JT=0
          JL=2
          JR=2
          JI=3
          INT8=8*IQNT

       DO K=1,IQNT
          T0=B0(K)+B1(K)
          T1=B0(K)-B1(K)
          T2=B2(K)+B2(K)
          T3=B3(K)+B3(K)
          T4=B4(K)+B6(K)
          T5=B4(K)-B6(K)
          T6=B7(K)-B5(K)
          T7=B7(K)+B5(K)
          T8=R2*(T7-T5)
          T5=R2*(T7+T5)
          TT0=T0+T2
          T2=T0-T2
          TT1=T1+T3
          T3=T1-T3
          T4=T4+T4
          T6=T6+T6
          B0(K)=TT0+T4
          B4(K)=TT0-T4
          B1(K)=TT1+T5
          B5(K)=TT1-T5
          B2(K)=T2+T6
          B6(K)=T2-T6
          B3(K)=T3+T8
          B7(K)=T3-T8
       end do

          IF (NT.EQ.0) GO TO 70

          K0=INT8+1
          KLAST=K0+IQNT-1

       DO K=K0,KLAST
          T1=B0(K)+B6(K)
          T3=B0(K)-B6(K)
          T2=B7(K)-B1(K)
          T4=B7(K)+B1(K)
          T5=B2(K)+B4(K)
          T7=B2(K)-B4(K)
          T6=B5(K)-B3(K)
          T8=B5(K)+B3(K)
          B0(K)=(T1+T5)+(T1+T5)
          B4(K)=(T2+T6)+(T2+T6)
          T5=T1-T5
          T6=T2-T6
          B2(K)=R2*(T6+T5)
          B6(K)=R2*(T6-T5)
          T1=T3*CPI8+T4*SPI8
          T2=T4*CPI8-T3*SPI8
          T3=T8*CPI8-T7*SPI8
          T4=-T7*CPI8-T8*SPI8
          B1(K)=(T1+T3)+(T1+T3)
          B5(K)=(T2+T4)+(T2+T4)
          T3=T1-T3
          T4=T2-T4
          B3(K)=R2*(T4+T3)
          B7(K)=R2*(T4-T3)
       end do

          GO TO 70

76        C1=CS(JT)
          S1=SS(JT)
          C2=C1*C1-S1*S1
          S2=C1*S1+C1*S1
          C3=C1*C2-S1*S2
          S3=C2*S1+S2*C1
          C4=C2*C2-S2*S2
          S4=C2*S2+C2*S2
          C5=C2*C3-S2*S3
          S5=C3*S2+S3*C2
          C6=C3*C3-S3*S3
          S6=C3*S3+C3*S3
          C7=C3*C4-S3*S4
          S7=C4*S3+S4*C3

          K=JI*INT8
          J0=JR*INT8+1
          JLAST=J0+IQNT-1

       DO J=J0,JLAST
          K=K+1
          TR0=B0(J)+B6(K)
          TR1=B0(J)-B6(K)
          TI0=B7(K)-B1(J)
          TI1=B7(K)+B1(J)
          TR2=B4(K)+B2(J)
          TI3=B4(K)-B2(J)
          TI2=B5(K)-B3(J)
          TR3=B5(K)+B3(J)
          TR4=B4(J)+B2(K)
          T0=B4(J)-B2(K)
          TI4=B3(K)-B5(J)
          T1=B3(K)+B5(J)
          TR5=CPI4*(T1+T0)
          TI5=CPI4*(T1-T0)
          TR6=B6(J)+B0(K)
          T0=B6(J)-B0(K)
          TI6=B1(K)-B7(J)
          T1=B1(K)+B7(J)
          TR7=-CPI4*(T0-T1)
          TI7=-CPI4*(T0+T1)
          T0=TR0+TR2
          TR2=TR0-TR2
          T1=TI0+TI2
          TI2=TI0-TI2
          T2=TR1+TR3
          TR3=TR1-TR3
          T3=TI1+TI3
          TI3=TI1-TI3
          T5 =TI4+TI6
          TTR6=TI4-TI6
          TI6=TR6-TR4
          T4 =TR4+TR6
          T7 =TI5+TI7
          TTR7=TI5-TI7
          TI7=TR7-TR5
          T6 =TR5+TR7
          B0(J)=T0+T4
          B0(K)=T1+T5
          B1(J)=C1*(T2+T6)-S1*(T3+T7)
          B1(K)=C1*(T3+T7)+S1*(T2+T6)
          B2(J)=C2*(TR2+TTR6)-S2*(TI2+TI6)
          B2(K)=C2*(TI2+TI6)+S2*(TR2+TTR6)
          B3(J)=C3*(TR3+TTR7)-S3*(TI3+TI7)
          B3(K)=C3*(TI3+TI7)+S3*(TR3+TTR7)
          B4(J)=C4*(T0-T4)-S4*(T1-T5)
          B4(K)=C4*(T1-T5)+S4*(T0-T4)
          B5(J)=C5*(T2-T6)-S5*(T3-T7)
          B5(K)=C5*(T3-T7)+S5*(T2-T6)
          B6(J)=C6*(TR2-TTR6)-S6*(TI2-TI6)
          B6(K)=C6*(TI2-TI6)+S6*(TR2-TTR6)
          B7(J)=C7*(TR3-TTR7)-S7*(TI3-TI7)
          B7(K)=C7*(TI3-TI7)+S7*(TR3-TTR7)
       end do

          JR=JR+2
          JI=JI-2
          IF (JI.GT.JL) GO TO 70
          JI=JR+JR-1
          JL=JR
70        JT=JT+1
            IF (JT.LT.NT) GO TO 76

      RETURN
      END subroutine DR8SYN

      SUBROUTINE DR4SYN(IQNT,B0,B1,B2,B3)
      !****************************************************************
      !
      !     RADIX 4 SYNTHESIS SUBROUTINE
      !     CALLED BY DRST, THE SINE TRANSFORM DRIVER.
      !
      !****************************************************************

      implicit integer(kind=4) (i-n)
      implicit real(kind=8) (a-h, o-z)

      DIMENSION B0(*),B1(*),B2(*),B3(*)

       DO K=1,IQNT
          T0=B0(K)+B1(K)
          T1=B0(K)-B1(K)
          T2=B2(K)+B2(K)
          T3=B3(K)+B3(K)
          B0(K)=T0+T2
          B2(K)=T0-T2
          B1(K)=T1+T3
          B3(K)=T1-T3
         end do

      RETURN
      END subroutine dr4syn

      SUBROUTINE DR2TR(IQNT,B0,B1)
      !****************************************************************
      !
      !     RADIX 2 TRANSFORM SUBROUTINE
      !     CALLED BY DRST, THE SINE TRANSFORM DRIVER.
      !
       !****************************************************************

      implicit integer(kind=4) (i-n)
      implicit real(kind=8) (a-h, o-z)

      DIMENSION B0(*),B1(*)

       DO K=1,IQNT
          T=B0(K)+B1(K)
          B1(K)=B0(K)-B1(K)
          B0(K)=T
       end do

      RETURN
      END subroutine dr2tr

!   *********************************************************
