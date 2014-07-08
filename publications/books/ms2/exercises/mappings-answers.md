---
layout: default
title: Modelling Systems Using Mappings
---

## Modelling Systems: Answers to Additional Exercises on Mappings

### Students and courses

~~~ 
types

  School :: students: set of Student 
            classes : map Course to set of Student;

  Student = token;

  Course = token;

functions

  EmptyClass: School * Course -> bool
  EmptyClass(sch,cor) ==
    sch.classes(cor) = {}
  pre cor in set dom sch.classes;

  Between3and5: School -> bool
  Between3and5(mk_School(studs,class)) ==
    forall s in set studs &
       let no = card Courses(class,s)
       in
         3 <= no and no <= 5;

  Courses: (map Course to set of Student) * Student -> set of Course
  Courses(class,stu) ==
    {course | course in set dom class & stu in set class(course)};

  NewStudent: School * Student -> School
  NewStudent(mk_School(studs,class),stu) ==
    mk_School(studs union {stu}, class)
  pre not stu in set studs;

  NewCourse: School * Student * Course -> School
  NewCourse(mk_School(sts,clm),s,c) ==
    mk_School(sts,clm ++ {c |-> clm(c) union {s}})
  pre s in set sts and c in set dom clm;

  DropStudent: School * Student -> School
  DropStudent(mk_School(sts,clm),stu) ==
    mk_School(sts \ {stu},{c |-> clm(c) \ {stu} | c in set dom clm})
  pre stu in set sts;

  DropCourse: School * Student * Course -> School
  DropCourse(mk_School(sts,clm),stu,cor) ==
    mk_School(sts,clm ++ {cor |-> clm(cor) \ {stu}})
  pre cor in set dom clm and stu in set clm(cor);
~~~ 


### A library database

~~~ 
values 
  maxbooks : nat = 5; 

types 

  Lib = map Copy to [User]; 

  Copy :: id : BookId 
          book : Book; 

  Book :: title : Text 
          author : Author 
          area : set of Subject; 

  BookId = token; 

  Author :: name : Text; 

  Subject :: area : Text; 

  Text = seq of char; 

  User = Staff | Borrower; 

  Staff :: id : UserId ; 

  Borrower :: id : UserId; 

  UserId = token; 

functions 

  BorrowBook: Lib * Copy * User * Staff -> Lib 
  BorrowBook(lib,copy,user,-) == 
    lib ++ {copy |-> user} 
  pre copy in set dom lib and 
      lib(copy) = nil and 
      BooksBorrowed(lib,user) < maxbooks; 

  ReturnBook: Lib * Copy * Staff -> Lib 
  ReturnBook(lib,copy,-) == 
    lib ++ {copy |-> nil} 
  pre copy in set dom lib and 
      lib(copy) <> nil; 

  AddBook: Lib * Copy* Staff -> Lib 
  AddBook(lib,copy,-) == 
    lib munion {copy |-> nil} 
  pre copy not in set dom lib; 

  RemoveBook: Lib * Copy * Staff -> Lib 
  RemoveBook(lib,copy,-) == 
    {copy} <-: lib 
  pre copy in set dom lib; 

  ExtractAuthorOrArea: Lib * (Author | Subject) -> set of Book 
  ExtractAuthorOrArea(lib,autsub) == 
    {copy.book | copy in set dom lib 
               & if is_Author(autsub) 
                 then copy.book.author = autsub 
                 else autsub in set copy.book.area}; 

  BorrowedBooks: Lib * User * User -> set of Book 
  BorrowedBooks(lib,user,resp) == 
    {copy.book | copy in set dom lib & lib(copy) = user} 
  pre is_Staff(resp) or user = resp; 
  
  Last: Lib * Copy * Staff -> [User] 
  Last(lib,copy,-) == 
    lib(copy) 
  pre copy in set dom lib; 

  BooksBorrowed: Lib * User -> nat 
  BooksBorrowed(lib,user) == 
    card {bookid | bookid in set dom lib & lib(bookid) = user}; 
~~~ 
