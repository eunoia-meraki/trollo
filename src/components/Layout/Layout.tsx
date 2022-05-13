import { ReactNode, type FC } from 'react';
import { Sticky, StickyContainer } from 'react-sticky';

import { Header } from './Header';

export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <StickyContainer className="min-w-full">
      <Sticky>
        {({ style, isSticky }) => (
          <div className="min-w-full" style={style}>
            <Header isSticky={isSticky} />
          </div>
        )}
      </Sticky>
      <div className="container mx-auto p-2">
        {children}
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim commodi quo minus, mollitia
        nemo tempore ea ipsam vero, reiciendis consequuntur eveniet, suscipit saepe quod maxime!
        Itaque maxime ullam labore sint? Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Enim commodi quo minus, mollitia nemo tempore ea ipsam vero, reiciendis consequuntur
        eveniet, suscipit saepe quod maxime! Itaque maxime ullam labore sint? Lorem ipsum dolor sit
        amet consectetur, adipisicing elit. Enim commodi quo minus, mollitia nemo tempore ea ipsam
        vero, reiciendis consequuntur eveniet, suscipit saepe quod maxime! Itaque maxime ullam
        labore sint? Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim commodi quo
        minus, mollitia nemo tempore ea ipsam vero, reiciendis consequuntur eveniet, suscipit saepe
        quod maxime! Itaque maxime ullam labore sint? Lorem ipsum dolor sit amet consectetur,
        adipisicing elit. Enim commodi quo minus, mollitia nemo tempore ea ipsam vero, reiciendis
        consequuntur eveniet, suscipit saepe quod maxime! Itaque maxime ullam labore sint? Lorem
        ipsum dolor sit amet consectetur, adipisicing elit. Enim commodi quo minus, mollitia nemo
        tempore ea ipsam vero, reiciendis consequuntur eveniet, suscipit saepe quod maxime! Itaque
        maxime ullam labore sint? Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim
        commodi quo minus, mollitia nemo tempore ea ipsam vero, reiciendis consequuntur eveniet,
        suscipit saepe quod maxime! Itaque maxime ullam labore sint? Lorem ipsum dolor sit amet
        consectetur, adipisicing elit. Enim commodi quo minus, mollitia nemo tempore ea ipsam vero,
        reiciendis consequuntur eveniet, suscipit saepe quod maxime! Itaque maxime ullam labore
        sint? Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim commodi quo minus,
        mollitia nemo tempore ea ipsam vero, reiciendis consequuntur eveniet, suscipit saepe quod
        maxime! Itaque maxime ullam labore sint?
      </div>
    </StickyContainer>
  );
};
