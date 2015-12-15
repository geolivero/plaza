//
//  UIReactAlert.m
//  plaza
//
//  Created by Gerald Olivero on 13/12/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import "UIReactAlert.h"


@interface UIReactAlert ()
  @property (nonatomic, strong) NSDictionary *defaultOptions;
  @property (nonatomic, retain) NSMutableDictionary *options;
  @property (nonatomic, strong) RCTResponseSenderBlock callback;
@end


@implementation UIReactAlert

RCT_EXPORT_MODULE();


- (instancetype)init
{
  
  if (self = [super init]) {
    self.defaultOptions = @{
                            @"image": @"",
                            @"buttons": @[]
                            };
  }
  
  return self;
}



RCT_EXPORT_METHOD(showAlert:(NSDictionary *)params callback:(RCTResponseSenderBlock)callback) {
  
  
}

@end
