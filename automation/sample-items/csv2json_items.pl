#!/usr/bin/perl -w

use strict;
use warnings;

use IO::File;

my %ids;
while (my $line = (<>)) {
    next if $line =~ /^#/;
    chomp($line);
    $line =~ s/"/\\"/g;
    my($id, $author, $name, $year, $notes) = split(',', $line);
    next if $id eq 'id';

    die "$ARGV:$.:duplicate id '$id'" if $ids{$id};
    $ids{$id} = 1;

    my $fileName = "sample-item$id.json";
    my $f = new IO::File(">$fileName")
	or die "can't create file '$fileName': $!";

    $id = sprintf("9a953a27-b3f7-49d7-968d-0d0a517a%04d", $id);
    print $f <<__EOT__;
{
  "id": "$id",
  "instanceId": "x-$id",
  "title": "$name",
  "author": "$author",
  "date": "$year",
  "comment": "$notes",
  "barcode": "whatever"
}

__EOT__

    $f->close();
}
