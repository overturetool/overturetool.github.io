---
layout: default
title: graph-edSL
---

## graph-edSL
Author: V. S. Alagar and D. Muthiayen and K. Periyasamy


Alagar, Muthiayen and Periyasamy have developed formal specifications for 
a Graph Editor using VDM-SL. More information can be found in:

V.S. Alagar, D. Muthiayen and K. Periyasamy, "VDM-SL Specification of a Graph 
Editor", Technical Report, Department of Computer Science, Concordia 
University, Montreal, Canada, May 1996. 


| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|


### graph-ed.vdmsl

{% raw %}
~~~
                                               

module GRAPH

   exports all

definitions

types

   Point :: xcoord : nat
            ycoord : nat;

   LineSegment :: end1 : Point
                  end2 : Point

   inv mk_LineSegment(end1, end2) ==
         end1 <> end2;

   Circle :: center : Point
             radius : nat1;

   Ellipse :: center  : Point
              xradius : nat1
              yradius : nat1;

   Polygon :: vertices : seq1 of Point

   inv mk_Polygon(points) ==
         len points > 2;

   Polyline :: vertices : seq1 of Point

   inv mk_Polyline(points) ==
         len points > 1;

   Box :: corner1 : Point
          corner2 : Point

   inv mk_Box(corner1, corner2) ==
         corner1.xcoord <> corner2.xcoord and corner1.ycoord <> corner2.ycoord;

   ArcBox :: box : Box
             cornerradius : nat1;

   Text :: frame : Box
           startpoint : Point
           string : seq of char

   inv mk_Text(frame, startpoint, string) ==
         abs (frame.corner1.ycoord - frame.corner2.ycoord) >= 20 and
         point_within_box(startpoint, frame) and
         (frame.corner1.ycoord < frame.corner2.ycoord and
             startpoint.ycoord + len(string) * 10 <= frame.corner2.ycoord or
          frame.corner1.ycoord > frame.corner2.ycoord and
             startpoint.ycoord + len(string) * 10 <= frame.corner1.ycoord);

   Compound :: frame : Box
               components : seq1 of Object

   inv mk_Compound(frame, components) ==
       forall obj in set elems components &
            object_within_box(obj, frame);

   Object = Circle | Ellipse | Polygon | Polyline | Box | ArcBox | Text | 
            Compound;

   Message = <SUCCESS> | <NOT_FIT> | <TEXT_NOT_FIT> |
             <NO_COMPONENT> | <NOT_COMPOUND> |
             <ERROR_FRAME_SIZE> | <ERROR_START_POINT> |
             <ERROR_NUM_VERTICES>

                             

state GraphEditor of

DRAWING_AREA : Box

OBJECTS : seq of Object

inv mk_GraphEditor(drawing_area, objects) ==

   drawing_area.corner1.xcoord = 0 and
   drawing_area.corner1.ycoord = 0 and
   drawing_area.corner2.xcoord = 500 and
   drawing_area.corner2.ycoord = 350 and

   forall object in set elems objects &
      object_within_box(object, drawing_area)


init mk_GraphEditor(drawing_area, objects) ==

   drawing_area.corner1.xcoord = 0 and
   drawing_area.corner1.ycoord = 0 and
   drawing_area.corner2.xcoord = 500 and
   drawing_area.corner2.ycoord = 350 and
   objects = []

end

                             

functions

   point_on_line : Point * LineSegment +> bool
   point_on_line(point, line) ==

      (point.xcoord - line.end2.xcoord) * 
      (line.end1.xcoord - line.end2.xcoord) > 0 and

      (point.xcoord - line.end2.xcoord) < 
      (line.end1.xcoord - line.end2.xcoord) and

      (point.xcoord - line.end2.xcoord) * 
      (line.end1.ycoord - line.end2.ycoord) =
   (line.end1.xcoord - line.end2.xcoord) * 
   (point.ycoord - line.end2.ycoord);


   point_on_circle : Point * Circle +> bool
   point_on_circle(point, circle) ==

      (circle.center.xcoord - point.xcoord) ** 2 +

      (circle.center.ycoord - point.ycoord) ** 2 = circle.radius ** 2;


   point_on_ellipse : Point * Ellipse +> bool
   point_on_ellipse(point, ellipse) ==

      ellipse.yradius ** 2 * (ellipse.center.xcoord - point.xcoord) ** 2 +

      ellipse.xradius ** 2 * (ellipse.center.ycoord - point.ycoord) ** 2 =

      ellipse.xradius ** 2 * ellipse.yradius ** 2;


   point_on_polygon : Point * Polygon +> bool
   point_on_polygon(point, polygon) ==

      exists index in set inds polygon.vertices &

         point_on_line(point, mk_LineSegment
                                            (polygon.vertices(index),
                      polygon.vertices(index mod len polygon.vertices + 1)));


   point_on_polyline : Point * Polyline +> bool
   point_on_polyline(point, polyline) ==

      exists index in set {i | i : nat1 
                             & i in set inds polyline.vertices and 
                               i <> len polyline.vertices} &

         point_on_line(point, mk_LineSegment
                                            (polyline.vertices(index),
                      polyline.vertices(index + 1)));


   point_on_box : Point * Box +> bool
   point_on_box(point, box) ==

      (((((point.xcoord >= box.corner1.xcoord) and 
          (point.xcoord <= box.corner2.xcoord)) or

         ((point.xcoord >= box.corner2.xcoord) and 
          (point.xcoord <= box.corner1.xcoord))) and

        ((point.ycoord = box.corner1.ycoord) or 
         (point.ycoord = box.corner2.ycoord))) or

       ((((point.ycoord >= box.corner1.ycoord) and 
          (point.ycoord <= box.corner2.ycoord)) or

         ((point.ycoord >= box.corner2.ycoord) and 
          (point.ycoord <= box.corner1.ycoord))) and

        ((point.xcoord = box.corner1.xcoord) or 
         (point.xcoord = box.corner2.xcoord))));


   point_on_arcbox : Point * ArcBox +> bool
   point_on_arcbox(point, arcbox) ==

      point_on_box(point, arcbox.box);


   point_on_text : Point * Text +> bool
   point_on_text(point, text) ==

      point_within_box(point, text.frame);


   point_on_compound : Point * Compound +> bool
   point_on_compound(point, compound) ==

      point_on_box(point, compound.frame);


   point_on_object : Point * Object +> bool
   point_on_object(point, object) ==

      (is_Circle(object) and point_on_circle(point, object)) or
      (is_Ellipse(object) and point_on_ellipse(point, object)) or
      (is_Polygon(object) and point_on_polygon(point, object)) or
      (is_Polyline(object) and point_on_polyline(point, object)) or
      (is_Box(object) and point_on_box(point, object)) or
      (is_ArcBox(object) and point_on_box(point, object.box)) or
      (is_Text(object) and point_within_box(point, object.frame)) or
      (is_Compound(object) and point_on_box(point, object.frame));


   point_within_box : Point * Box +> bool
   point_within_box(point, box) ==

      ((point.xcoord > box.corner1.xcoord and 
        point.xcoord < box.corner2.xcoord) or
       (point.xcoord > box.corner2.xcoord and 
        point.xcoord < box.corner1.xcoord)) and

      ((point.ycoord > box.corner1.ycoord and 
        point.ycoord < box.corner2.ycoord) or
       (point.ycoord > box.corner2.ycoord and 
        point.ycoord < box.corner1.ycoord));


   circle_within_box : Circle * Box +> bool
   circle_within_box(circle, box) ==

      point_within_box(mk_Point(circle.center.xcoord + circle.radius, 
                                circle.center.ycoord), box) and
      point_within_box(mk_Point(circle.center.xcoord - circle.radius, 
                                circle.center.ycoord), box) and
      point_within_box(mk_Point(circle.center.xcoord, 
                                circle.center.ycoord + circle.radius), 
                                box) and
      point_within_box(mk_Point(circle.center.xcoord, 
                                circle.center.ycoord - circle.radius), 
                                box);


   ellipse_within_box : Ellipse * Box +> bool
   ellipse_within_box(ellipse, box) ==

      point_within_box(mk_Point(ellipse.center.xcoord + ellipse.xradius, 
                                ellipse.center.ycoord), box) and
      point_within_box(mk_Point(ellipse.center.xcoord - ellipse.xradius, 
                                ellipse.center.ycoord), box) and
      point_within_box(mk_Point(ellipse.center.xcoord, 
                                ellipse.center.ycoord + ellipse.yradius), 
                                box) and
      point_within_box(mk_Point(ellipse.center.xcoord, 
                                ellipse.center.ycoord - ellipse.yradius), 
                                box);


   polygon_within_box : Polygon * Box +> bool
   polygon_within_box(polygon, box) ==

      forall vertex in set elems polygon.vertices &
         point_within_box(vertex, box);


   polyline_within_box : Polyline * Box +> bool
   polyline_within_box(polyline, box) ==

      forall vertex in set elems polyline.vertices &
         point_within_box(vertex, box);


   box_within_box : Box * Box +> bool
   box_within_box(box1, box2) ==

      point_within_box(box1.corner1, box2) and 
      point_within_box(box1.corner2, box2);


   object_within_box : Object * Box +> bool
   object_within_box(object, box) ==

      (is_Circle(object) and circle_within_box(object, box)) or
      (is_Ellipse(object) and ellipse_within_box(object, box)) or
      (is_Polygon(object) and polygon_within_box(object, box)) or
      (is_Polyline(object) and polyline_within_box(object, box)) or
      (is_Box(object) and box_within_box(object, box)) or
      (is_ArcBox(object) and box_within_box(object.box, box)) or
      (is_Text(object) and box_within_box(object.frame, box)) or
      (is_Compound(object) and box_within_box(object.frame, box));


   copy_point(point : Point, vector : LineSegment) newpoint : Point

   post

      newpoint.xcoord = point.xcoord + 
                        vector.end2.xcoord - 
                        vector.end1.xcoord and
      newpoint.ycoord = point.ycoord + 
                        vector.end2.ycoord - 
                        vector.end1.ycoord;


   copy_points(points : seq1 of Point, vector : LineSegment) 
               newpoints : seq1 of Point

   post

      len points = len newpoints and

      forall i in set inds points &

         newpoints(i) = copy_point(points(i), vector);


   make_copy_object(obj : Object, vector : LineSegment) newobj : Object

   post

      (is_Circle(obj) and 
       newobj = mk_Circle(copy_point(obj.center, vector), 
                          obj.radius)) or

      (is_Ellipse(obj) and 
       newobj = mk_Ellipse(copy_point(obj.center, vector),
                           obj.xradius, obj.yradius)) or

      (is_Polygon(obj) and 
       newobj = mk_Polygon(copy_points(obj.vertices, vector))) or

      (is_Polyline(obj) and 
       newobj = mk_Polyline(copy_points(obj.vertices, vector))) or

      (is_Box(obj) and 
       newobj = mk_Box(copy_point(obj.corner1, vector),
                       copy_point(obj.corner2, vector))) or

      (is_ArcBox(obj) and 
       newobj = mk_ArcBox(mk_Box(copy_point(obj.box.corner1, vector),
                                 copy_point(obj.box.corner2, vector)), 
                          obj.cornerradius)) or

      (is_Text(obj) and 
       newobj = mk_Text(mk_Box(copy_point(obj.frame.corner1, vector),
                        copy_point(obj.frame.corner2, vector)),
                        copy_point(obj.startpoint, vector), obj.string)) or

      (is_Compound(obj) and 
       newobj = mk_Compound(mk_Box(copy_point(obj.frame.corner1, vector),
                                   copy_point(obj.frame.corner2, vector)),
                            make_copy_objects(obj.components, vector)));


   make_copy_objects(objs : seq1 of Object, vector : LineSegment) 
                     newobjs : seq1 of Object

   post

      len newobjs = len objs and

      newobjs = [make_copy_object(o, vector) | o in seq objs]


operations

   create_circle(center : Point, radius : nat1) msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      circle_within_box(mk_Circle(center, radius), DRAWING_AREA)

   post

      OBJECTS = [mk_Circle(center, radius)] ^ OBJECTS~ and msg = <SUCCESS>

   errs

      NOT_FIT : not circle_within_box(mk_Circle(center, radius), DRAWING_AREA) 
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>;


   create_ellipse(center : Point, xradius : nat1, yradius : nat1) msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      ellipse_within_box(mk_Ellipse(center, xradius, yradius), DRAWING_AREA)

   post

      OBJECTS = [mk_Ellipse(center, xradius, yradius)] ^ OBJECTS~ and 
      msg = <SUCCESS>

   errs

      NOT_FIT : not ellipse_within_box(mk_Ellipse(center, xradius, yradius), 
                                       DRAWING_AREA)
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>;


   create_polygon(vertices : seq1 of Point) msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      polygon_within_box(mk_Polygon(vertices), DRAWING_AREA)

   post

      OBJECTS = [mk_Polygon(vertices)] ^ OBJECTS~ and msg = <SUCCESS>

   errs

      NOT_FIT : not polygon_within_box(mk_Polygon(vertices), DRAWING_AREA)
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>;


   create_polyline(vertices : seq1 of Point) msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      polyline_within_box(mk_Polyline(vertices), DRAWING_AREA)

   post

      OBJECTS = [mk_Polyline(vertices)] ^ OBJECTS~ and msg = <SUCCESS>

   errs

      NOT_FIT : not polyline_within_box(mk_Polyline(vertices), 
                                        DRAWING_AREA)
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>;

   create_box(corner1 : Point, corner2 : Point) msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      box_within_box(mk_Box(corner1, corner2), DRAWING_AREA)

   post

      OBJECTS = [mk_Box(corner1, corner2)] ^ OBJECTS~ and 
      msg = <SUCCESS>

   errs

      NOT_FIT : not box_within_box(mk_Box(corner1, corner2), 
                                   DRAWING_AREA)
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>;


   create_arcbox(corner1 : Point, corner2 : Point, cornerradius : nat1) 
                 msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      box_within_box(mk_Box(corner1, corner2), DRAWING_AREA)

   post

      OBJECTS = [mk_ArcBox(mk_Box(corner1, corner2), cornerradius)] ^ 
                OBJECTS~ and
      msg = <SUCCESS>

   errs

      NOT_FIT : not box_within_box(mk_Box(corner1, corner2), 
                                   DRAWING_AREA)
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>;


   create_text(corner1 : Point, corner2 : Point, 
               startpoint : Point, string : seq of char)
            msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      box_within_box(mk_Box(corner1, corner2), DRAWING_AREA) and

      abs (corner1.ycoord - corner2.ycoord) >= 20 and

      point_within_box(startpoint, mk_Box(corner1, corner2)) and

      (corner1.ycoord < corner2.ycoord and
          startpoint.ycoord + len(string) * 10 <= corner2.ycoord or
       corner1.ycoord > corner2.ycoord and
          startpoint.ycoord + len(string) * 10 <= corner1.ycoord)

   post

      OBJECTS = [mk_Text(mk_Box(corner1, corner2), startpoint, string)] ^ 
                OBJECTS~ and
        msg = <SUCCESS>

   errs

      NOT_FIT : not box_within_box(mk_Box(corner1, corner2), 
                                   DRAWING_AREA)
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>

      FRAME_SIZE : abs (corner1.ycoord - corner2.ycoord) < 20
                    -> OBJECTS = OBJECTS~ and 
                       msg = <ERROR_FRAME_SIZE>

      START_POINT : not point_within_box(startpoint, 
                                         mk_Box(corner1, corner2))
                    -> OBJECTS = OBJECTS~ and 
                       msg = <ERROR_START_POINT>

      TEXT_NOT_FIT : corner1.ycoord < corner2.ycoord and
                       startpoint.ycoord + len(string) * 10 > 
                       corner2.ycoord or
                     corner1.ycoord > corner2.ycoord and
                       startpoint.ycoord + len(string) * 10 > 
                       corner1.ycoord
                     -> OBJECTS = OBJECTS~ and 
                        msg = <TEXT_NOT_FIT>;


   create_compound_object(corner1 : Point, corner2 : Point) 
                          msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      box_within_box(mk_Box(corner1, corner2), 
                     DRAWING_AREA) and

      exists object in set elems OBJECTS &

         object_within_box(object, mk_Box(corner1, corner2))

   post

      let components : seq1 of Object =
                [o | o in seq OBJECTS~ 
                & object_within_box(o, mk_Box(corner1, corner2))] in

      OBJECTS = [mk_Compound(mk_Box(corner1, corner2), components)] ^
                [o | o in seq OBJECTS~ &
                 not object_within_box(o, mk_Box(corner1, corner2))] and 
      msg = <SUCCESS>

   errs

      NOT_FIT : not box_within_box(mk_Box(corner1, corner2), 
                                   DRAWING_AREA)
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>

      NO_COMPONENT : not exists object in set elems OBJECTS &

                         object_within_box(object, 
                                           mk_Box(corner1, corner2))

                     -> OBJECTS = OBJECTS~ and msg = <NO_COMPONENT>;


   select_object(click : Point) object : [Object]

   ext rd DRAWING_AREA : Box

       rd OBJECTS : seq of Object

   pre

      point_within_box(click, DRAWING_AREA)

   post

      object in set elems OBJECTS and 
      point_on_object(click, object) and

      forall i in set {index | index : nat1, j : nat1 &

                        index in set inds OBJECTS and 
                        index < j and OBJECTS(j) = object} &

          not point_on_object(click, OBJECTS(i))

   errs

      NO_SELECT : not exists obj in set elems OBJECTS &

                     point_on_object(click, obj) -> 
                     object = nil;


   decompose_compound_object(object : Object) msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      is_Compound(object) and object in set elems OBJECTS

   post

      OBJECTS = object.components ^
              [o | o in seq OBJECTS~ & o <> object] and
      msg = <SUCCESS>

   errs

      NOT_COMPOUND : not is_Compound(object) -> 
                     msg = <NOT_COMPOUND>;


   delete_object(object : Object)

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      object in set elems OBJECTS

   post

      OBJECTS = [o | o in seq OBJECTS~ & o <> object];


   move_object(object : Object, vector : LineSegment) 
               msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      object in set elems OBJECTS

   post
      let stold = mk_GraphEditor(DRAWING_AREA,OBJECTS~),
          stnew = mk_GraphEditor(DRAWING_AREA,OBJECTS)
      in
      is_Compound(object) and 
      post_move_compound_object(object,vector,msg,stold,stnew) or

      not is_Compound(object) and 
      post_move_simple_object(object,vector,msg,stold,stnew);


   move_simple_object(object : Object, vector : LineSegment) 
                      msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      object in set elems OBJECTS and 
      not is_Compound(object) and

      object_within_box(make_copy_object(object, vector), 
                        DRAWING_AREA)

   post

      OBJECTS = [make_copy_object(object, vector)] ^ 
                 [o | o in seq OBJECTS~ & o <> object] and 
      msg = <SUCCESS>

   errs

      NOT_FIT : not object_within_box(make_copy_object(object, vector), 
                                      DRAWING_AREA)
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>;


   move_compound_object(compound : Compound, vector : LineSegment) 
                        msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      compound in set elems OBJECTS and

      object_within_box(make_copy_object(compound.frame, vector), 
                        DRAWING_AREA)

   post

      OBJECTS = [make_copy_object(compound, vector)] ^ 
                 [o | o in seq OBJECTS & o <> compound] and 
      msg = <SUCCESS>

   errs

      NOT_FIT : not object_within_box(make_copy_object(compound.frame, 
                                                       vector),
                   DRAWING_AREA)
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>;


   copy_object(object : Object, vector : LineSegment) 
               msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      object in set elems OBJECTS

   post
      let stold = mk_GraphEditor(DRAWING_AREA,OBJECTS~),
          stnew = mk_GraphEditor(DRAWING_AREA,OBJECTS)
      in      
      is_Compound(object) and 
      post_copy_compound_object(object,vector,msg,stold,stnew) or

      not is_Compound(object) and 
      post_copy_simple_object(object,vector,msg,stold,stnew);


   copy_simple_object(object : Object, vector : LineSegment) 
                      msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      object in set elems OBJECTS and 
      not is_Compound(object) and

      object_within_box(make_copy_object(object, vector), 
                        DRAWING_AREA)

   post

      OBJECTS = [make_copy_object(object, vector)] ^ OBJECTS~ and 
      msg = <SUCCESS>

   errs

      NOT_FIT : not object_within_box(make_copy_object(object, vector), 
                                      DRAWING_AREA)
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>;


   copy_compound_object(compound : Compound, vector : LineSegment) 
                        msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      compound in set elems OBJECTS and is_Compound(compound) and

      object_within_box(make_copy_object(compound.frame, vector), 
                        DRAWING_AREA)

   post

      OBJECTS = [make_copy_object(compound, vector)] ^ OBJECTS~ and 
      msg = <SUCCESS>

   errs

      NOT_FIT : not object_within_box(make_copy_object(compound.frame, 
                                                       vector),
                   DRAWING_AREA)
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>;


   resize_circle(circle : Circle, new_radius : nat1) 
                 msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      circle in set elems OBJECTS and

      circle_within_box(mk_Circle(circle.center, new_radius), 
                        DRAWING_AREA)

   post

      OBJECTS = [mk_Circle(circle.center, new_radius)] ^
                [o | o in seq OBJECTS~ & o <> circle] and 
      msg = <SUCCESS>

   errs

      NOT_FIT : not circle_within_box(mk_Circle(circle.center, new_radius), 
                                      DRAWING_AREA)
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>;


   resize_ellipse(ellipse : Ellipse, new_xradius : nat1, 
                  new_yradius : nat1) msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      ellipse in set elems OBJECTS and

      ellipse_within_box(mk_Ellipse(ellipse.center, 
                                    new_xradius, 
                                    new_yradius), 
                         DRAWING_AREA)

   post

      OBJECTS = [mk_Ellipse(ellipse.center, new_xradius, new_yradius)] ^
                [o | o in seq OBJECTS~ & o <> ellipse]
 and msg = <SUCCESS>

   errs

      NOT_FIT : not ellipse_within_box(mk_Ellipse(ellipse.center, 
                                                  new_xradius, 
                                                  new_yradius),
              DRAWING_AREA)
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>;


   resize_polygon(polygon : Polygon, new_vertices : seq1 of Point) 
                  msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      polygon in set elems OBJECTS and

      len new_vertices = len polygon.vertices and

      polygon_within_box(mk_Polygon(new_vertices), DRAWING_AREA)

   post

      OBJECTS = [mk_Polygon(new_vertices)] ^
                [o | o in seq OBJECTS~ & o <> polygon]
 and msg = <SUCCESS>

   errs

      NUM_VERTICES : len new_vertices <> len polygon.vertices
                     -> OBJECTS = OBJECTS~ and 
                        msg = <ERROR_NUM_VERTICES>

      NOT_FIT : not polygon_within_box(mk_Polygon(new_vertices), 
                                       DRAWING_AREA)
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>;


   resize_polyline(polyline : Polyline, new_vertices : seq1 of Point) 
                   msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      polyline in set elems OBJECTS and

      len new_vertices = len polyline.vertices and

      polyline_within_box(mk_Polyline(new_vertices), DRAWING_AREA)

   post

      OBJECTS = [mk_Polyline(new_vertices)] ^
                [o | o in seq OBJECTS~ & o <> polyline] and 
      msg = <SUCCESS>

   errs

      NUM_VERTICES : len new_vertices <> len polyline.vertices
                     -> OBJECTS = OBJECTS~ and 
                        msg = <ERROR_NUM_VERTICES>

      NOT_FIT : not polyline_within_box(mk_Polyline(new_vertices), 
                                        DRAWING_AREA)
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>;


   resize_box(box : Box, new_corner1 : Point, new_corner2 : Point) 
              msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      box in set elems OBJECTS and

      box_within_box(mk_Box(new_corner1, new_corner2), 
                     DRAWING_AREA)

   post

      OBJECTS = [mk_Box(new_corner1, new_corner2)] ^
                [o | o in seq OBJECTS~ & o <> box] and 
      msg = <SUCCESS>

   errs

      NOT_FIT : not box_within_box(mk_Box(new_corner1, new_corner2), 
                                   DRAWING_AREA)
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>;


   resize_arcbox(arcbox : ArcBox, new_corner1 : Point, 
                 new_corner2 : Point, new_corner_radius : nat1) 
                 msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      arcbox in set elems OBJECTS and

      box_within_box(mk_Box(new_corner1, new_corner2), 
                     DRAWING_AREA) 

   post

      OBJECTS = [mk_ArcBox(mk_Box(new_corner1, new_corner2), 
                           new_corner_radius)] ^
                [o | o in seq OBJECTS~ & o <> arcbox] and 
      msg = <SUCCESS>

   errs

      NOT_FIT : not box_within_box(mk_Box(new_corner1, new_corner2), 
                                   DRAWING_AREA)
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>;


   edit_text(text : Text, new_corner1 : Point, new_corner2 : Point,
             new_start_point : Point, new_string : seq of char) 
             msg : Message

   ext rd DRAWING_AREA : Box

       wr OBJECTS : seq of Object

   pre

      text in set elems OBJECTS and

      box_within_box(mk_Box(new_corner1, new_corner2), DRAWING_AREA) and

      abs (new_corner1.ycoord - new_corner2.ycoord) >= 20 and

      point_within_box(new_start_point, mk_Box(new_corner1, new_corner2)) and

      (new_corner1.ycoord < new_corner2.ycoord and
         new_start_point.ycoord + len(new_string) * 10 <= new_corner2.ycoord or
       new_corner1.ycoord > new_corner2.ycoord and
         new_start_point.ycoord + len(new_string) * 10 <= new_corner1.ycoord)

   post

      OBJECTS = [mk_Text(mk_Box(new_corner1, new_corner2), 
                 new_start_point, new_string)] ^
                [o | o in seq OBJECTS~ & o <> text] and msg = <SUCCESS>

   errs

      NOT_FIT : not box_within_box(mk_Box(new_corner1, new_corner2), 
                                   DRAWING_AREA)
                -> OBJECTS = OBJECTS~ and msg = <NOT_FIT>

      FRAME_SIZE : abs (new_corner1.ycoord - new_corner2.ycoord) < 20
                   -> OBJECTS = OBJECTS~ and msg = <ERROR_FRAME_SIZE>

      START_POINT : not point_within_box(new_start_point, 
                                         mk_Box(new_corner1, new_corner2))
                    -> OBJECTS = OBJECTS~ and msg = <ERROR_START_POINT>

      TEXT_NOT_FIT : new_corner1.ycoord < new_corner2.ycoord and
         new_start_point.ycoord + len(new_string) * 10 <= 
         new_corner2.ycoord or
       new_corner1.ycoord > new_corner2.ycoord and
         new_start_point.ycoord + len(new_string) * 10 <= 
         new_corner1.ycoord
                -> OBJECTS = OBJECTS~ and msg = <TEXT_NOT_FIT>

end GRAPH

              
~~~
{% endraw %}

